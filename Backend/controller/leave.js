import { Leave } from "../model/Leave.js"
import { Employee } from '../model/Employee.js'
import moment from "moment"
import { Holiday } from "../model/Holiday.js"
import { LeaveCondition } from "../model/LeaveCondition.js"


export function getformattedDate(stringDate) {
    const date = stringDate ? new Date(Date.parse(stringDate)) : new Date()
    const month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
    return Date.parse(date.getFullYear() + "-" + (month) + "-" + (date.getDate()))
}

const getLeaveConditions = async () => {
    return await LeaveCondition.findOne({})
}

export const getAvailableLeaves = async (emp_id) => {
    //check for prevous leave (same year)
    const start_date = getformattedDate(new Date().getFullYear + "-01-01")
    const end_date = getformattedDate()
    const status = 1

    const result = await Leave.find({
        $and: [
            { emp_id: emp_id },
            { applied_on: { $gte: start_date, $lte: end_date } },
            { status: status }
        ]
    }, ["numberOfDays"])

    let spendedLeaves = 0
    result.forEach(leave => {
        spendedLeaves += leave.numberOfDays.paid_leaves
    })

    const leaveCondtion = await getLeaveConditions()
    const monthly_leave = leaveCondtion != null ? leaveCondtion.monthly : 1

    const paidLeaves = Math.floor((new Date().getMonth() + 1) * monthly_leave)
    const availableLeave = paidLeaves - spendedLeaves

    // console.log(monthly_leave)

    return availableLeave
}

const checkForHolidays = async (start_date, end_date) => {
    const result = await Holiday.find({
        $and: [
            { date: { $gte: start_date, $lte: end_date } },
        ]
    }).countDocuments()

    return result
}

export const dateDiff = (start_date, end_date) => {
    return (moment(end_date, "YYYY-MM-DD").diff(moment(start_date, "YYYY-MM-DD"), 'days') + 1)
}

export const applyLeave = async (req, res) => {
    const out = {}
    try {
        const emp_id = req.body.emp_id
        if (!emp_id)
            throw Error("emp_id is required")

        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
        if (emp_check == 0)
            throw Error("Invalid emp_id")

        if (!req.body.reason)
            throw Error("reason is missing")

        const leave_type = parseInt(req.body.leave_type) || 3 //fullday leave (single day)

        if (!req.body.start_date)
            throw Error("Start Date is missing")

        if (leave_type === 4 && !req.body.end_date)
            throw Error("End Date is missing")

        const start_date = getformattedDate(req.body.start_date)
        const end_date = getformattedDate(req.body.end_date || req.body.start_date)

        const numberOfLeaveDays = (leave_type <= 2 ? 0.5 : ((leave_type === 3) ? 1 : dateDiff(req.body.start_date, req.body.end_date)))

        //check for holidays between start and end date 
        const numberOfHolidays = await checkForHolidays(start_date, end_date)


        let numberOfDays = 0
        if (numberOfHolidays < numberOfLeaveDays)
            numberOfDays = numberOfLeaveDays - numberOfHolidays
        else
            throw Error("No need to apply for leave, holidays will cover the leave days")


        //check for weekend (sunday only)
        let weekends = 0
        let date = moment(req.body.start_date, "YYYYMMDD")
        for (var i = 0; i < numberOfLeaveDays; i++) {
            const day = date.format("dddd")
            if (day.localeCompare("Sunday") === 0) {
                if (await checkForHolidays(date.format("YYYY-MM-DD"), date.format("YYYY-MM-DD")) > 0) continue

                numberOfDays -= 1
                weekends++
            }
            date = date.add(1, "days")
        }

        //check if eligible for leave or not (1 day of paid leave per month allowed)
        const availablePaidLeaves = await getAvailableLeaves(emp_id)

        let paid_leaves = availablePaidLeaves
        let unpaid_leaves = 0
        if (availablePaidLeaves < numberOfDays)
            unpaid_leaves = numberOfDays - availablePaidLeaves
        else
            paid_leaves = numberOfDays


        // if (availablePaidLeaves < numberOfDays)
        //     throw Error("not enough available leaves")

        const leave = new Leave({
            emp_id: emp_id,
            leave_type: leave_type,
            reason: req.body.reason,
            applied_on: getformattedDate(),
            start_date: start_date,
            end_date: end_date,
            numberOfDays: {
                leave_days: numberOfLeaveDays,
                paid_leaves: paid_leaves,
                unpaid_leaves: unpaid_leaves,
                holidays: numberOfHolidays,
                weekends: weekends,
                final_leave_days: numberOfDays
            },
            attachments: req.body.attachment || null
        })

        // console.log(days)

        await leave.save()
        out.message = "success"
        out.error = false
        out.data = leave

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

//Get the leave requests
export const getLeaveRequests = async (req, res) => {
    const out = {}
    try {
        const status = req.body.status
        const conditions = {}
        if (status)
            conditions.status = parseInt(status)

        // console.log(conditions)
        const pageNumber = parseInt(req.body.current_page) || 1
        const itemPerPage = 5
        const total = await Leave.find(conditions).countDocuments()

        const leaveCheck = await Leave.find(conditions)
            .sort({ applied_on: "asc" })
            .skip(pageNumber > 1 ? (pageNumber - 1) * itemPerPage : 0)
            .limit(itemPerPage)

        out.message = "success"
        out.error = false
        out.current_page = pageNumber
        out.item_perpage = itemPerPage
        out.total_page = Math.ceil(total / itemPerPage)
        out.data = leaveCheck
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

export const getLeaveRequestIds = async (req, res) => {
    const out = {}
    try {
        const status = req.body.status
        const conditions = {}
        if (status)
            conditions.status = parseInt(status)

        const leaveCheck = await Leave.distinct("emp_id", conditions)

        out.message = "success"
        out.error = false
        out.data = leaveCheck
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

export const getLeaveHistory = async (req, res) => {
    const out = {}
    try {
        const emp_id = req.body.emp_id
        let conditions = []
        if (!emp_id)
            throw Error("emp_id is required")

        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
        if (emp_check == 0)
            throw Error("Invalid emp_id")

        if (emp_id) {
            conditions.push(
                { 'emp_id': emp_id },
            )
        }

        if (req.body.start_date && req.body.end_date) {
            const startOfMonth = getformattedDate(req.body.start_date)
            const endOfMonth = getformattedDate(req.body.end_date)

            conditions.push(
                { applied_on: { $gte: startOfMonth, $lte: endOfMonth } }
            )
        }

        if (req.body.status) {
            conditions.push(
                { status: req.body.status }
            )
        }
        // console.log(conditions)


        const pageNumber = parseInt(req.body.current_page) || 1
        const itemPerPage = 10
        const total = await Leave
            .find(conditions.length > 0 ? { $and: conditions } : {})
            .countDocuments()

        const leaveCheck = await Leave
            .find(conditions.length > 0 ? { $and: conditions } : {})
            .sort({ applied_on: "asc" })
            .skip(pageNumber > 1 ? ((pageNumber - 1) * itemPerPage) : 0)
            .limit(itemPerPage)

        out.message = "success"
        out.error = false
        out.current_page = pageNumber
        out.item_perpage = itemPerPage
        out.total_page = Math.ceil(total / itemPerPage)
        out.data = leaveCheck

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const changeStatus = async (req, res) => {
    const out = {}
    try {
        const id = req.body.id
        if (!id)
            throw Error("id is required")

        if (!req.body.status)
            throw Error("status is required")

        const status = parseInt(req.body.status)

        if (status === 2) // rejected
            if (!req.body.remarks)
                throw Error("Remarks is required")


        const update = {
            status: status,
            remarks: req.body.remarks || null,
            status_modified_date: getformattedDate()
        }

        // await Leave.updateOne({ _id: id }, { $set: update })

        out.message = "success"
        out.error = false
        out.data = await Leave.updateOne({ _id: id }, { $set: update })

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const updateCriteria = async (req, res) => {
    const out = {}
    try {
        const emp_id = req.body.emp_id
        if (!emp_id)
            throw Error("emp_id is required")

        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
        if (emp_check == 0)
            throw Error("Invalid emp_id")


        if (!req.body.yearly)
            throw Error("yearly leave is required")

        const yearly_leave = req.body.yearly
        //update here
        await LeaveCondition.deleteMany({})
        const lc = new LeaveCondition({
            updated_by: emp_id,
            yearly: yearly_leave,
            monthly: (yearly_leave / 12),
        })

        await lc.save()
        out.message = "success"
        out.error = false
        out.data = lc

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}


export const getLeaveDetails = async (req, res) => {
    const out = {}
    try {
        const data = {}
        const lc = await getLeaveConditions()

        const emp_id = req.body.emp_id
        if (emp_id) {
            const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
            if (emp_check == 0)
                throw Error("Invalid emp_id")

            data.availableLeave = await getAvailableLeaves(emp_id)
        }

        data.yearly_leave = lc ? lc.yearly : 12
        data.monthly_leave = lc ? lc.monthly : 1
        out.message = "success"
        out.error = false
        out.data = data

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

