import mongoose from 'mongoose'

const bankSchema = new mongoose.Schema
    (
        {
            emp_id: { type: String, required: true },
            bankname: { type: String, required: true,default:'NA' },
            branch: { type: String, required: true,default:'NA' },
            account_no: { type: String, required: true },
            ifsc: { type: String, required: true },
            esic: { type: String, required: true, default: "NA" },
            pan_number: { type: String, required: true },
            uan: { type: String, default: 'NA' }
        }
    )
//bankSchema.index({ emp_id: 1, email: 1 }, { unique: true, unique: true })

export const Bank = mongoose.model("Bank", bankSchema)