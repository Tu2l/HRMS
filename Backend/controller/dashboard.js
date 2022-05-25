import { Attendance } from "../model/Attendance.js"
import { Employee } from "../model/Employee.js"
import { Project } from "../model/Project.js"
import { Leave } from "../model/Leave.js"
import { Salary } from "../model/Salary/Salary.js"
import { getRemark } from "./attendance.js"
import { getAvailableLeaves, getformattedDate } from "./leave.js"


export const getEmpDashboard = async (req, res) => {
    const out = {}
    try {
        const emp_id = req.body.emp_id

        if (!emp_id)
            throw Error("Employee id required!")

        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
        if (emp_check == 0)
            throw Error("Invalid emp_id")

        const date = new Date()

        //attendance
        const att = await Attendance.findOne({ $and: [{ emp_id: emp_id }, { attendanceType: 1 }, { date: getformattedDate(date) }] })
        const isAttendanceMarked = att ? true : false
        const attendanceRemark = att ? getRemark(att) : 'Absent'

        //payslip
        const month = date.getMonth()
        const year = date.getFullYear()

        if (!month || !year) throw new Error("Month or Year is missing!")

        const sal = await Salary.findOne(
            {
                emp_id: emp_id,
                month: month,
                year: year,
            }, ['emp_id']
        )
        const isPayslipgenerated = sal ? true : false
        //leavesremaining
        const availableLeave = await getAvailableLeaves(emp_id)

        out.message = "success"
        out.error = false
        out.data = {
            attendance_marked: isAttendanceMarked,
            attendance_remark: attendanceRemark,
            payslip_generated: isPayslipgenerated,
            availableLeave: availableLeave
        }

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const getAdminDashboad = async (req, res) => {
    const out = {}
    try {
        //total status:
        const total_active_emp = await Employee.find({ status: { $in: [0, 3, 4] } }, ["emp_id"]).countDocuments()
        const total_inactive_emp = await Employee.find({ status: { $in: [1, 2] } }, ["emp_id"]).countDocuments()

        //present
        const date = getformattedDate()
        const attendances = await Attendance.find({ $and: [{ date: date }, { attendanceType: 1 }] })
        const total_present = attendances.length
        //absent
        const total_absent = total_active_emp - total_present
        //late
        let total_late = 0
        attendances.forEach((att) => {
            if (getRemark(att) === "Late")
                total_late++
        })
        //pending leave
        const total_pending_leaves = await Leave.find({ status: 0 }).countDocuments()
        //pending project
        const total_pending_projects = await Project.find({ status: 0 }).countDocuments()

        out.message = "success"
        out.error = false
        out.data = {
            active_emp: total_active_emp,
            inactive_emp: total_inactive_emp,
            present_emp: total_present,
            absent_emp: total_absent,
            late_emp: total_late,
            pending_leave_requests: total_pending_leaves,
            pending_projects: total_pending_projects
        }

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}
