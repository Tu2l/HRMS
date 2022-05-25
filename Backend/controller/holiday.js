import { Holiday } from "../model/Holiday.js"
import moment from "moment"

function getformattedDate(stringDate) {
    const date = stringDate ? new Date(Date.parse(stringDate)) : new Date()
    const month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
    return Date.parse(date.getFullYear() + "-" + (month) + "-" + (date.getDate()))
}

export const getHolidayHistory = async (req, res) => {
    const out = {}
    try {
        const conditions = []
        let startDate, endDate
        if (req.body.start_date && req.body.end_date) {
            startDate = getformattedDate(req.body.start_date)
            endDate = getformattedDate(req.body.end_date)
        } else {
            const year = new Date().getFullYear()
            startDate = getformattedDate(year + "-01-01")
            endDate = getformattedDate(year + "-12-31")
        }

        conditions.push(
            { date: { $gte: startDate, $lte: endDate } }
        )

        const pageNumber = parseInt(req.body.current_page) || 1
        const itemPerPage = 10
        const total = await Holiday
            .find(conditions.length > 0 ? { $and: conditions } : {})
            .countDocuments()

        const holidays = await Holiday
            .find(conditions.length > 0 ? { $and: conditions } : {})
            .sort({ date: "asc" })
            .skip(pageNumber > 1 ? ((pageNumber - 1) * itemPerPage) : 0)
            .limit(itemPerPage)

        out.message = "success"
        out.error = false
        out.current_page = pageNumber
        out.item_perpage = itemPerPage
        out.total_page = Math.ceil(total / itemPerPage)
        out.data = holidays

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const addHoliday = async (req, res) => {
    const out = {}
    try {

        if (!req.body.date || !req.body.name) {
            throw Error("Date and Name is missing!")
        }

        const date = getformattedDate(req.body.date)
        const holidayCheck = await Holiday.find({ $and: [{ date: date }, { name: req.body.name }] }).countDocuments()

        if (holidayCheck > 0) throw Error("Same Holiday Already Exists")


        const result = new Holiday({
            date: date,
            name: req.body.name
        })
        await result.save()

        out.message = "success"
        out.error = false
        out.data = result

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const addHolidayRange = async (req, res) => {
    const out = {}
    try {

        if (!req.body.name)
            throw Error("Holiday Name is missing!")

        if (!req.body.start_date || !req.body.end_date)
            throw Error("Holiday date range is missing!")

        const days = (moment(req.body.end_date, "YYYY-MM-DD").diff(moment(req.body.start_date, "YYYY-MM-DD"), 'days') + 1)

        const hodlidays = []
        let date = moment(req.body.start_date, "YYYYMMDD")
        if (req.body.end_date) {
            for (var i = 0; i < days; i++) {
                const formattedDate = getformattedDate(date)
                const holidayCheck = await Holiday.find({ $and: [{ date: formattedDate }, { name: req.body.name }] }).countDocuments()

                if (holidayCheck > 0) continue

                const result = new Holiday({
                    date: formattedDate,
                    name: req.body.name
                })
                await result.save()
                hodlidays.push(result)
                date = date.add(1, "days")
            }
        }


        out.message = "success"
        out.error = false
        out.data = hodlidays

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const deleteHoliday = async (req, res) => {
    const out = {}
    try {
        const conditions = []
        let startDate, endDate
        if (req.body.start_date && req.body.end_date) {
            startDate = getformattedDate(req.body.start_date)
            endDate = getformattedDate(req.body.end_date)
        } else {
            throw Error("date is missing!")
        }
        conditions.push(
            { date: { $gte: startDate, $lte: endDate } }
        )

        const holidays = await Holiday.deleteMany({ $and: conditions })

        out.message = "success"
        out.error = false
        out.data = holidays

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}


