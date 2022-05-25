import mongoose from 'mongoose'


const addressSchema = new mongoose.Schema
    (
        {
            emp_id: {type: String, required: true},
            address: {type: String, required: true},
            city: {type: String, required: true},
            district: {type: String, required: true},
            block: {type: String, required: true},
            state: {type: String, required: true},
            phone: {type: String, required: true},
            zip_code: {type: String, required: true},
        }
    )


const officeShema = new mongoose.Schema
    (
        {
            name: {type: String, required: true},
            location: {type: addressSchema, required: true},
            emp_list: {type: [String], default: []},
        }
    )

export const Office = mongoose.model("Office", officeShema)