import mongoose from 'mongoose'

const personalDetailSchema = new mongoose.Schema
    (
        {
            emp_id: {type: String, required: true},
            qualification: {type: String, default: "NA"},
            father_name: {type: String, default: "NA"},
            gender: {
                type: Number, required: [true, "Gender is required"],
                min: [1 ,"1->male"],
                max: [2 ,"2->female"]
            },
            marital : {
                type: Number, required: [true, "Marital Status is required"],
                min: [1 ,"1->married"],
                max: [2 ,"2->unmarried"]
            },
            aadhar_number: {type: String},
        }
    )

export const PersonalDetail = mongoose.model("PersonalDetail", personalDetailSchema)
