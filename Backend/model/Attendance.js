import moment from 'moment'
import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema
    (
        {
            emp_id: { type: String, required: true },
            attendanceType: {
                type: Number,
                required: [true, "Attendance type is requred"],
                min: [1 ,"attendanceType must be in the range of 1-2, 1->checkin & 2->checkout"],
                max: [2 ,"attendanceType must be in the range of 1-2, 1->checkin & 2->checkout"]
            },
            date: { type: Date, default: new Date() },
            timestamp: { type: String, default: (moment().format("LTS")) }
        }
    )

export const Attendance = mongoose.model("Attendance", attendanceSchema)