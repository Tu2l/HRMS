import mongoose from 'mongoose'

const allowanceSchema = new mongoose.Schema
    (
        {
            emp_id: { type: String, required: true },
            date:{type:Date, default: Date.now(),required:true},
            name: { type: String, required: true },
            amount: { type: Number, default: 0 },
            status: {
                type: Number, default: 0,
                min: [0, "0 -> unverified, 1 -> verified"],
                max: [1, "0 -> unverified, 1 -> verified"]
            },

            files: { type: [String], default: [] },
        }
    )

export const Allowance = mongoose.model("Allowance", allowanceSchema)