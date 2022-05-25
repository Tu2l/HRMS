import mongoose from 'mongoose'

const leaveConditionSchema = new mongoose.Schema
    (
        {
            updated_by: { type: String, required: [true, "emp_id of updater is required"] },
            yearly: { type: Number, default: 18, required: true },
            monthly: { type: Number, required: true },
        }
    )

export const LeaveCondition = mongoose.model("LeaveCondition", leaveConditionSchema)