import mongoose from 'mongoose'

const numberOfDaysSchema = new mongoose.Schema
    (
        {
            leave_days: { type: Number, default: 0 },
            paid_leaves: { type: Number, default: 0 },
            unpaid_leaves: { type: Number, default: 0 },
            holidays: { type: Number, default: 0 },
            weekends: { type: Number, default: 0 },
            final_leave_days: { type: Number, default: 0 }
        }
    )

const leaveSchema = new mongoose.Schema
    (
        {
            emp_id: { type: String, required: true },
            leave_type: {
                type: Number, default: 3,
                min: [1, "1 first half, 2 2nd half , 3->Full Day, 4->Multiple Days"],
                max: [4, "1 first half, 2 2nd half , 3->Full Day, 4->Multiple Days"]
            },
            reason: {
                type: String,
                required: [true, "reason is requred"],
            },
            applied_on: { type: Date, default: new Date() },
            start_date: { type: Date, required: [true, "start date is missing"] },
            end_date: { type: Date, required: [true, "end date is missing"] },
            numberOfDays: { type: numberOfDaysSchema, default: {} },
            status: {
                type: Number, default: 0,
                min: [0, "status must be in the range of 0-3, 0->pending & 1->approved & 2->rejected & 3->cancelled"],
                max: [3, "status must be in the range of 0-3, 0->pending & 1->approved & 2->rejected & 3->cancelled"]
            },
            remarks: { type: String, default: null },
            attachments: { type: String, default: null },
            status_modified_date: {type: Date, default : null}
        }
    )

export const Leave = mongoose.model("Leave", leaveSchema)