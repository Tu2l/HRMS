import { Employee } from '../model/Employee.js'
import { Attendance } from '../model/Attendance.js'
import { PersonalDetail } from '../model/PersonalDetail.js'
import { Bank } from '../model/Bank.js'
import { getRemark } from '../controller/attendance.js'
import pkg from 'xlsx';
import path from 'path'
import moment from 'moment'
import { getformattedDate } from './leave.js'
import { Salary } from '../model/Salary/Salary.js'

function getTimestamp(arr, type) {
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            const att = arr[i]
            if (att.attendanceType === type) return att.timestamp
        }
    }

    return '-'
}



function getServiceStatus(status) {
    switch (status) {
        case 0: return 'In-Service'
        case 1: return 'Resigned'
        case 2: return 'Terminated'
        case 3: return 'Notice Period'
        case 4: return 'Probation'
    }
}


export const exportEmp = async (req, res) => {
    const out = {}
    try {
        const file = pkg.utils.book_new()
        var result = await Employee.find()
        var data = []
        result.forEach(emp => {
            const _data = { ...emp._doc }
            delete _data['_id']
            delete _data['password']
            delete _data['userType']
            delete _data['__v']
            _data.status = getServiceStatus(_data.status)
            data.push(_data)

        })

        const emp_sheet = pkg.utils.json_to_sheet(data)
        pkg.utils.book_append_sheet(file, emp_sheet, "Employee")

        var result = await PersonalDetail.find()
        var data = []
        result.forEach(personal => {
            const _data = { ...personal._doc }
            delete _data['_id']
            delete _data['__v']
            _data.gender = _data.gender === 1 ? 'Male' : 'Female'
            _data.marital = _data.marital === 1 ? 'Married' : 'Single'
            data.push(_data)
        })
        const personal_details_sheet = pkg.utils.json_to_sheet(data)
        pkg.utils.book_append_sheet(file, personal_details_sheet, "Personal Details")


        var result = await Bank.find()
        var data = []
        result.forEach(bank => {
            const _data = { ...bank._doc }
            delete _data['_id']
            delete _data['__v']
            data.push(_data)
        })
        const bank_sheet = pkg.utils.json_to_sheet(data)
        pkg.utils.book_append_sheet(file, bank_sheet, "Bank Details")
        const filename = new Date().getMilliseconds() + '_emp.xlsx'

        pkg.writeFile(file, path.join('public/temp', filename))
        out.error = false
        out.message = 'success'
        out.data = req.headers.host + '/temp/' + filename

        // res.sendFile(file);

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


export const exportAttendance = async (req, res) => {
    const out = {}
    try {
        if (!req.body.date) throw new Error('Date is missing')

        const results = await Employee.find({ status: { $in: (req.body.status ? [req.body.status] : [0, 3, 4]) } }, ["emp_id", "name"]).sort({ name: "asc" })

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

        var data = []
        employees.forEach(att => {
            const _data = { ...att }
            delete _data['_id']
            delete _data['__v']
            _data.checkin = getTimestamp(_data.attendance, 1)
            _data.checkout = getTimestamp(_data.attendance, 2)
            delete _data['attendance']
            _data.remark = _data.remark ? _data.remark : 'Absent'
            data.push(_data)
        })
        const file = pkg.utils.book_new()
        const attendance_sheet = pkg.utils.json_to_sheet(data)
        pkg.utils.book_append_sheet(file, attendance_sheet, "Attendance")
        pkg.writeFile(file, path.join('public/temp', (req.body.date + '-attendance.xlsx')))

        out.error = false
        out.message = 'success'
        out.data = req.headers.host + '/temp/' + (req.body.date + '-attendance.xlsx')

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

export const exportAttendanceByMonth = async (req, res) => {
    const out = {}
    try {
        if (!req.body.date) throw new Error('Date is missing')

        const date = new Date(req.body.date)
        const month = (date.getMonth() + 1) < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        const year = date.getFullYear()
        const total_days = moment(year + "-" + month, "YYYY-MM").daysInMonth()

        const results = await Employee.find({ status: { $in: (req.body.status ? [req.body.status] : [0, 3, 4]) } }, ["emp_id", "name"]).sort({ name: "asc" })

        const employees = []
        for (let i = 0; i < results.length; i++) {
            const emp = { ...results[i]._doc }

            for (let j = 1; j <= total_days; j++) {
                const start_date = year + "-" + month + '-' + ((j < 9) ? ("0" + j) : j)
                const attendance = await Attendance.findOne({
                    $and:
                        [
                            { emp_id: results[i].emp_id },
                            { date: getformattedDate(start_date) },
                            { attendanceType: 1 }
                        ]
                })

                emp[start_date] = attendance ? getRemark(attendance.timestamp) : 'absent'

                // console.log(attendance)
            }
            employees.push(emp)

        }

        var data = []
        employees.forEach(emp => {
            const _data = { ...emp }
            delete _data['_id']
            delete _data['__v']
            data.push(_data)
        })

        // console.log(month)
        const file = pkg.utils.book_new()
        const attendance_sheet = pkg.utils.json_to_sheet(data)
        pkg.utils.book_append_sheet(file, attendance_sheet, "Attendance")
        pkg.writeFile(file, path.join('public/temp', (month + '-attendance.xlsx')))

        out.error = false
        out.message = 'success'
        out.data = req.headers.host + '/temp/' + (month + '-attendance.xlsx')

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

export const exportSalaryByMonth = async (req, res) => {
    const out = {}
    try {
        if (!req.body.date) throw new Error('Date is missing')

        const date = new Date(req.body.date)
        const month = (date.getMonth() + 1) < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        const year = date.getFullYear()

        const results = await Employee.find({ status: { $in: (req.body.status ? [req.body.status] : [0, 3, 4]) } }, ["emp_id", "name"]).sort({ name: "asc" })

        const employees = []
        for (let i = 0; i < results.length; i++) {
            const salary = await Salary.findOne({
                emp_id: results[i].emp_id,
                month: month,
                year: year,
            })
            const deductions = {}
            const additions = {}
            if (salary) {
                deductions.pf = salary.deductions[0].amount
                deductions.tds = salary.deductions[1].amount
                deductions.professtion_tax = salary.deductions[2].amount
                deductions.salary_advance = salary.deductions[3].amount
                deductions.leave_days = salary.deductions[4].amount
                deductions.late_coming_days = salary.deductions[5].amount
                deductions.esic = salary.deductions[6].amount

                additions.conveyance = salary.addition[0].amount
                additions.special_allowance = salary.addition[1].amount
                additions.performance_allowance = salary.addition[2].amount
                additions.bonus = salary.addition[3].amount

            }

            const sal = salary ? { ...{ remarks: 'Salary Generated successfully' }, ...salary._doc, ...additions, ...deductions } : { remarks: 'Pay details or Bank details missing' }

            employees.push({ ...results[i]._doc, ...sal })

        }

        var data = []
        employees.forEach(emp => {
            const _data = { ...emp }
            delete _data['_id']
            delete _data['__v']
            delete _data['deductions']
            delete _data['addition']
            delete _data['allowance']
            data.push(_data)
        })

        // console.log(month)
        const file = pkg.utils.book_new()
        const salaries_sheet = pkg.utils.json_to_sheet(data)
        pkg.utils.book_append_sheet(file, salaries_sheet, "Salaries")
        pkg.writeFile(file, path.join('public/temp', (month + '-salaries.xlsx')))

        out.error = false
        out.message = 'success'
        out.data = req.headers.host + '/temp/' + (month + '-salaries.xlsx')

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