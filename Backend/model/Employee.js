import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema
    (
        {
            emp_id: { type: String, required: true },
            email: { type: String, required: true },
            password: { type: String, required: true },
            name: { type: String, required: true },
            phone: { type: String, required: true, default: "NA" },
            dob: { type: String, required: true, default: "NA" },
            designation: { type: String, required: true, default: "NA" },
            department: { type: String, required: true, default: "NA" },
            join_date: { type: Date, required: [true, "Date is missing"] }, //new update
            status: { //new update
                type: Number, required: true, default: 0,
                min: [0, "0->servicing, 1->resigned, 2->terminated, 3->Notice Period, 4->Probation"],
                max: [4, "0->servicing, 1->resigned, 2->terminated, 3->Notice Period, 4->Probation"]
            },
            profile_img: { type: String, default: null },
            userType: {
                type: Number, required: true, default: 0
            },
            cv_file: { type: String, default: null },
            appointment_file: { type: String, default: null }
        }
    )
employeeSchema.index({ emp_id: 1, email: 1 }, { unique: true, unique: true })

export const Employee = mongoose.model("Employee", employeeSchema)