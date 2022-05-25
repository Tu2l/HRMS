import mongoose from 'mongoose'

const designationSchema = new mongoose.Schema
    (
        {
            name: {type: String, required: true},
            total_capacity: {type: Number, required: true, default:0},
            departName:{type:String, required:[true,"Department Code is required"]},
        },
        {
            timestamps: true
        }
    )
designationSchema.index({ name: 1 }, { unique: true })

export const Designation = mongoose.model("Designation", designationSchema)