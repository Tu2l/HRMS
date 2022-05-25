import mongoose from 'mongoose'

const additional = new mongoose.Schema({
    name: { type: String, required: [true, "Incentive name is required"] },
    amount: { type: Number, required: [true, "Incentive amount is required"] }
})

const paySchema = new mongoose.Schema
    (
        {
            emp_id: { type: String, required: true },
            basic_pay: { type: Number, required: [true, "Basic pay amount is required"] },
            hra: { type: Number, required: [true, "HRA amount is required"] },
            epf: { type: Number, required: true, default: 0 },
            esic: { type: Number, required: true, default: 0 },
            deductions: { type: [additional], required: true, default: [] }, //pf,pt, tds,salary in advance
            addition: { type: [additional], required: true, default: [] }, //
        }
    )

export const Pay = mongoose.model("Pay", paySchema)