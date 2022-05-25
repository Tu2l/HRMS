import mongoose from 'mongoose'

const holidaySchema = new mongoose.Schema
    (
        {
            date: { type: Date, required: [true, "holiday date is missing"] },
            name: { type: String, required: [true, "holiday name is missing"] }
        }
    )

export const Holiday = mongoose.model("Holiday", holidaySchema)