import { Attendance } from "../model/Attendance.js"
import { Employee } from '../model/Employee.js'
import moment from "moment"

export function getRemark(checkin) {
    return (moment(checkin, 'LTS').isBefore(moment('10:01:00AM', 'LTS'))) ? 'On Time' : 'Late'
}

function getformattedDate(stringDate) {
    const date = stringDate ? new Date(Date.parse(stringDate)) : new Date()
    const month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    return Date.parse(date.getFullYear() + "-" + (month) + "-" + (date.getDate()))
}

export const registerAttendance = async (req, res) => {
    const out = {}
    try {
        const emp_id = req.body.emp_id
        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()

        if (emp_check == 0)
            throw Error("Invalid emp_id")

        const attendanceType = req.body.attendanceType
        const date = getformattedDate()


        // date.setHours(0, 0, 0, 0)
        // console.log(date)

        const attendanceCheck = await Attendance.find({
            $and: [
                { emp_id: emp_id },
                { attendanceType: attendanceType },
                { date: date }
            ]
        }, []).limit(1)

        if (attendanceCheck.length > 0)
            throw Error("Attendance already exists")

        const attendance = new Attendance({
            emp_id: emp_id,
            attendanceType: attendanceType,
            date: date,
            timestamp: moment().format("LTS")
        })

        await attendance.save()
        out.message = "success"
        out.error = false
        out.data = attendance

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const getAttendance = async (req, res) => {
    const out = {}
    try {
        const conditions = []
        // if (!emp_id)
        // throw Error("emp_id is required")

        if (req.body.emp_id) {
            const emp_id = req.body.emp_id
            const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()

            if (emp_check == 0)
                throw Error("Invalid emp_id")

            conditions.push(
                { 'emp_id': emp_id },
            )
        }

        if (req.body.attendanceType) {
            const attendanceType = req.body.attendanceType || 1
            conditions.push(
                { 'attendanceType': attendanceType },
            )
        }

        if (req.body.date) {
            const date = getformattedDate(req.body.date)
            conditions.push(
                { 'date': date }
            )
        }
        // console.log(conditions)


        const pageNumber = parseInt(req.body.current_page) || 1
        const itemPerPage = 10
        const total = await Attendance
            .find(conditions.length > 0 ? { $and: conditions } : {})
            .countDocuments()

        const attendanceCheck = await Attendance
            .find(conditions.length > 0 ? { $and: conditions } : {})
            .sort({ date: "asc" })
            .skip(pageNumber > 1 ? ((pageNumber - 1) * itemPerPage) : 0)
            .limit(itemPerPage)

        out.message = "success"
        out.error = false
        out.current_page = pageNumber
        out.item_perpage = itemPerPage
        out.total_page = Math.ceil(total / itemPerPage)
        out.data = attendanceCheck

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const getEmpNAttendance = async (req, res) => {
    const out = {}
    try {
        // console.log(conditions)
        const query = req.body.query

        const pageNumber = parseInt(req.body.current_page) || 1
        const itemPerPage = 10
        const total = await Employee.find(query ?
            {
                name: {
                    $regex: query,
                    $options: "i",
                },
            } : { status: { $in: (req.body.status ? [req.body.status] : [0, 3, 4]) } }, ["emp_id"]).countDocuments()

        const results = await Employee.find(query ?
            {
                name:
                {
                    $regex: query,
                    $options: "i",
                },
            } : { status: { $in: (req.body.status ? [req.body.status] : [0, 3, 4]) } }, ["emp_id", "name", "phone", "designation", "profile_img",]
        )
            .sort({ name: "asc" })
            .skip(pageNumber > 1 ? (pageNumber - 1) * itemPerPage : 0)
            .limit(itemPerPage)

        const employees = []
        for (let i = 0; i < results.length; i++) {
            const emp = { ...results[i]._doc }

            const attendance = await Attendance.find({
                $and:
                    [
                        { emp_id: results[i].emp_id },
                        { date: getformattedDate(req.body.date) },
                    ]
            })

            emp.attendance = attendance
            for (let j = 0; j < attendance.length; j++) {
                const att = attendance[j];
                if (att.attendanceType == 1) {
                    emp.remark = getRemark(att.timestamp)
                    break
                }
            }
            // console.log(attendance)
            employees.push(emp)
        }

        out.message = "success"
        out.error = false
        out.current_page = pageNumber
        out.item_perpage = itemPerPage
        out.total_page = Math.ceil(total / itemPerPage)
        out.data = employees

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}


export const byRange = async (req, res) => {
    const out = {}
    try {
        const emp_id = req.body.emp_id
        let conditions = []
        if (!emp_id)
            throw Error("emp_id is required")

        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
        if (emp_check == 0)
            throw Error("Invalid emp_id")


        conditions.push(
            { 'emp_id': emp_id },
        )

        if (req.body.attendanceType) {
            const attendanceType = req.body.attendanceType || 1
            conditions.push(
                { 'attendanceType': attendanceType },
            )
        }

        if (req.body.start_date && req.body.end_date) {
            const startOfMonth = getformattedDate(req.body.start_date)
            const endOfMonth = getformattedDate(req.body.end_date)

            conditions.push(
                { date: { $gte: startOfMonth, $lte: endOfMonth } }
            )
        } else {

            throw Error("date range is missing")
        }
        // console.log(conditions)


        const pageNumber = parseInt(req.body.current_page) || 1
        const itemPerPage = 10
        const total = await Attendance
            .find(conditions.length > 0 ? { $and: conditions } : {})
            .countDocuments()

        const result = await Attendance
            .find(conditions.length > 0 ? { $and: conditions } : {})
            .sort({ date: "asc" })
            .skip(pageNumber > 1 ? ((pageNumber - 1) * itemPerPage) : 0)
            .limit(itemPerPage)

        const attendances = []
        for (let j = 0; j < result.length; j++) {
            const att = {...result[j]._doc}
            if (att.attendanceType == 1) {
                att.remark = getRemark(att.timestamp)
            }

            attendances.push(att)
        }
        out.message = "success"
        out.error = false
        out.current_page = pageNumber
        out.item_perpage = itemPerPage
        out.total_page = Math.ceil(total / itemPerPage)
        out.data = attendances

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const fillForTest = async (req, res) => {
    for (var i = 25; i < 31; i++) {
        const emp_id = "GT/0002/22"
        const date = "2022-04-" + ((i < 9) ? ("0" + i) : i)
        // console.log(date)
        const attendance = new Attendance({
            emp_id: emp_id,
            attendanceType: 1,
            date: date,
            timestamp: '11:00:00 AM'
        })

        await attendance.save()
    }

    res.send("done")
}