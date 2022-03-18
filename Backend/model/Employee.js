import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema
    (
        {
            emp_id: {type: String, required: true},
            email: {type: String, required: true},
            password:{type: String, required: true},
            name: {type: String, required: true},
            phone: {type: String, required: true},
            dob: {type: String, required: true},
            designation: {type: String, required: true},
            department: {type: String, required: true}
        }
    )
employeeSchema.index({ emp_id: 1, email: 1 }, { unique: true, unique: true })

export const Employee = mongoose.model("Employee", employeeSchema)