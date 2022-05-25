import mongoose from 'mongoose'

const departmentSchema = new mongoose.Schema
    (
        {
            name: { type: String, required: true },
        },
        {
            timestamps: true
        }
    )
departmentSchema.index({ name: 1 }, { unique: true })

export const Department = mongoose.model("Department", departmentSchema)