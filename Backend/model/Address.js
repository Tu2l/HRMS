import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema
    (
        {
            emp_id: {type: String, required: true},
            address: {type: String, required: true},
            city: {type: String, required: true},
            district: {type: String, required: true},
            block: {type: String, required: true, default:'NA'},
            state: {type: String, required: true},
            phone: {type: String, required: true, default:'NA'},
            zip_code: {type: String, required: true},
            address_type: {
                type: Number, required: true,
                min: [1, "1->Current Adddress"],
                max: [2, "2->Permanenet Address"]
            }
        }
    )

export const Address = mongoose.model("Address", addressSchema)
  