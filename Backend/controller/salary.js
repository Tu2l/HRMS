import moment from "moment"
import { Attendance } from "../model/Attendance.js"
import { Employee } from "../model/Employee.js"
import { Holiday } from "../model/Holiday.js"
import { Leave } from "../model/Leave.js"
import { Bank } from "../model/Bank.js"
import { Pay } from "../model/Salary/Pay.js"
import { Salary } from "../model/Salary/Salary.js"
import { dateDiff, getformattedDate } from "./leave.js"

async function calculateLOPs(emp_id, startOfMonth, endOfMonth) {
  const conditions = []

  conditions.push({ emp_id: emp_id }, { attendanceType: 1 })

  conditions.push({ date: { $gte: startOfMonth, $lte: endOfMonth } })

  const attendanceCheck = await Attendance.find({ $and: conditions }, [
    "timestamp",
    "date",
  ]).sort({ date: "asc" })

  const lateDays = []

  attendanceCheck.forEach((attendance) => {
    const late = moment(attendance.timestamp, "LTS").isBefore(
      moment("10:01:00AM", "LTS")
    )
      ? false
      : true
    if (late) lateDays.push(attendance)
  })

  // console.log(lateDays)
  //calculate working days
  let weekends = 0
  let workdays = 0
  const offDays = []
  let date = moment(startOfMonth, "YYYYMMDD")
  const numOfDays = dateDiff(moment(startOfMonth), moment(endOfMonth))

  for (var i = 0; i < numOfDays; i++) {
    const day = date.format("dddd")
    if (day.localeCompare("Sunday") === 0) {
      weekends++
      offDays.push(getformattedDate(date.format("YYYY-MM-DD")))
      // console.log(weekends)
    } else {
      workdays++
    }
    date = date.add(1, "days")
  }

  //calculate holidays
  var results = await Holiday.find({
    $and: [{ date: { $gte: startOfMonth, $lte: endOfMonth } }],
  })

  let holidays = 0
  for (var i = 0; i < results.length; i++) {
    const holiday = results[i]
    const date = getformattedDate(holiday.date)
    if (!offDays.includes(date)) holidays++
  }
  workdays = Math.abs(workdays - holidays)

  //calculate unpaid leaves
  results = await Leave.find(
    {
      $and: [
        { emp_id: emp_id },
        { applied_on: { $gte: startOfMonth, $lte: endOfMonth } },
        { status: 1 },
        { "numberOfDays.unpaid_leaves": { $gt: 0 } },
      ],
    },
    ["numberOfDays"]
  )

  var unpaid_leaves = 0
  for (var i = 0; i < results.length; i++) {
    const temp = results[i].numberOfDays
    unpaid_leaves += temp.unpaid_leaves
  }

  // console.log(results)
  return {
    total_workdays: workdays,
    total_holidays: holidays,
    total_weekends: weekends,
    total_unpaid_leaves: unpaid_leaves,
    late_days: lateDays.length,
    lops: lateDays.length >= 3 ? Math.floor(lateDays.length / 3) : 0,
    total_present_days: attendanceCheck.length,
    total_absent_days: Math.abs(workdays - attendanceCheck.length),
    days: lateDays,
  }
}

async function generate(emp_id, month, year) {
  const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
  if (emp_check == 0) throw Error("Invalid emp_id")

  const check = await Salary.findOne({
    emp_id: emp_id,
    month: month,
    year: year,
  })

  if (check) {
    return check
  }

  const pay = await Pay.findOne({ emp_id: emp_id })
  const bank = await Bank.findOne({ emp_id: emp_id })
  if (!pay) throw new Error("No Pay details found")
  if (!bank) throw new Error("No Bank details found")


  const total_days = moment(year + "-" + month, "YYYY-MM").daysInMonth()
  const start_date = year + "-" + month + "-01"
  const end_date = year + "-" + month + "-" + total_days

  const calculated = await calculateLOPs(emp_id, start_date, end_date)

  const additions = [...pay.addition]
  const deductions = [...pay.deductions]

  // console.log(deductions)

  const per_day = pay.basic_pay / total_days
  const absent_deduct = ((calculated.total_absent_days * per_day) + (calculated.total_unpaid_leaves * per_day))
  deductions.push({
    name: "Leave Days",
    amount: absent_deduct,
  })

  deductions.push({
    name: "Late Coming Days",
    amount: calculated.lops * per_day,
  })

  deductions.push({
    name: "ESIC",
    amount: pay.esic,
  })

  let gross = 0
  gross += pay.basic_pay
  gross += pay.hra
  gross += additions[0].amount
  gross += additions[1].amount
  // console.log("Gross:"+gross)

  var ctc_month = 0
  ctc_month += gross
  ctc_month += additions[2].amount
  ctc_month += additions[3].amount
  ctc_month += pay.epf
  ctc_month += pay.esic

  // console.log(ctc_month)

  let total_deductions = 0
  deductions.forEach((d) => {
    total_deductions += d.amount
    // console.log(d)
  })

  // console.log(total_deductions)
  const net = ctc_month - total_deductions

  const salary = new Salary({
    emp_id: emp_id,
    basic_pay: pay.basic_pay,
    hra: pay.hra,
    gross_monthly_salary: gross,
    net_salary: net,
    month: month,
    year: year,
    monthly_ctc: ctc_month,
    annual_ctc: ctc_month * 12,
    addition: additions,
    deductions: deductions,
    total_deductions: total_deductions,
    no_of_days: total_days,
    total_unpaid_leaves: (calculated.total_unpaid_leaves + calculated.total_absent_days),
    late_days: calculated.late_days
  })

  return await salary.save()
}

export const generateSalary = async (req, res) => {
  const out = {}
  try {
    const emp_id = req.body.emp_id
    if (!emp_id) throw Error("emp_id is required")

    const month = req.body.month
    const year = req.body.year

    if (!month || !year) throw new Error("Month or Year is missing!")

    out.error = false
    out.message = "success"
    out.data = await generate(emp_id, month, year)
  } catch (err) {
    console.log(err)
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}

export const generateSalaryForAll = async (req, res) => {
  const out = {}
  try {
    const month = req.body.month
    const year = req.body.year

    if (!month || !year) throw new Error("Month or Year is missing!")

    const users = await Employee.find({ status: { $in: (req.body.status ? [req.body.status] : [0, 3, 4]) } }, ['emp_id'])
    const data = []
    for (var i = 0; i < users.length; i++) {
      const user = users[i]
      try {
        await generate(user.emp_id, month, year)
        data.push({
          emp_id: user.emp_id,
          error: false,
          message: 'success'
        })
      } catch (ex) {
        data.push({
          emp_id: user.emp_id,
          error: true,
          message: ex.message
        })
      }
    }

    out.error = false
    out.message = "success"
    out.data = data
  } catch (err) {
    console.log(err)
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}

export const getSalaryHistory = async (req, res) => {
  const out = {}
  try {
    const emp_id = req.body.emp_id
    if (!emp_id) throw Error("emp_id is required")

    const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
    if (emp_check == 0) throw Error("Invalid emp_id")

    const pageNumber = parseInt(req.body.current_page) || 1
    const itemPerPage = 10
    const total = await Salary.find({ emp_id: emp_id }).countDocuments()

    const salary = await Salary.find({ emp_id: emp_id })
      .sort({ month: "desc" })
      .skip(pageNumber > 1 ? (pageNumber - 1) * itemPerPage : 0)
      .limit(itemPerPage)

    out.message = "success"
    out.error = false
    out.current_page = pageNumber
    out.item_perpage = itemPerPage
    out.total_page = Math.ceil(total / itemPerPage)
    out.data = salary
  } catch (err) {
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}

export const getSalaryHistoryByMonth = async (req, res) => {
  const out = {}
  try {
    const emp_id = req.body.emp_id
    if (!emp_id) throw Error("emp_id is required")

    const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
    if (emp_check == 0) throw Error("Invalid emp_id")

    const month = req.body.month
    const year = req.body.year

    if (!month || !year) throw new Error("Month or Year is missing!")

    const check = await Salary.findOne({
      emp_id: emp_id,
      month: month,
      year: year,
    })

    if (!check) throw new Error("Salary not generated!")
    out.error = false
    out.message = "success"
    out.data = check
  } catch (err) {
    // console.log(err)
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}

