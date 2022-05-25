import { Address } from "../model/Address.js"
import { Employee } from "../model/Employee.js"


//get Address
export const getAddress = async (req, res) => {
    const out = {}
    try {
        const emp_id = req.body.emp_id
        if (!emp_id)
            throw Error("emp_id is required")

        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
        if (emp_check == 0)
            throw Error("Invalid emp_id")


        const address_type = req.body.address_type

        let currentAddressCheck = {}

        if (req.body.address_type)
            currentAddressCheck = await Address.findOne({ emp_id: emp_id, address_type: address_type })
        else
            currentAddressCheck = await Address.find({ emp_id: emp_id })

        out.message = "success"
        out.error = false
        out.data = currentAddressCheck

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

// Update Address
export const updateAddress = async (req, res) => {
    const out = {}
    try {

        const emp_id = req.body.emp_id
        const address_type = req.body.address_type
        if (!emp_id)
            throw Error("Employee id required!")

        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
        if (emp_check == 0)
            throw Error("Invalid emp_id")

        const value = {}
        var result = {}

        if (!address_type) throw Error("Address Type is missing")

        value.emp_id = emp_id

        if (req.body.address)
            value.address = req.body.address

        if (req.body.city)
            value.city = req.body.city

        if (req.body.district)
            value.district = req.body.district

        if (req.body.block)
            value.block = req.body.block

        if (req.body.state)
            value.state = req.body.state

        if (req.body.phone)
            value.phone = req.body.phone

        if (req.body.zip_code)
            value.zip_code = req.body.zip_code

        value.address_type = address_type

        const checkExistance1 = await Address.findOne({ $and: [{ emp_id: emp_id }, { address_type: address_type }] })
        // console.log(checkExistance1)
        if (checkExistance1 === null) {
            result = new Address(value)
            await result.save()
            // console.log("SAVE")
        }
        else {
            result = await Address.updateOne({ emp_id: emp_id, address_type: address_type }, { $set: value })
            // console.log("Update")
        }

        out.message = "success"
        out.error = false
        out.data = result

    } catch (error) {
        out.message = error.message
        out.error = true
        out.data = null
    }
    finally {
        //setting the output
        res.send(out)
    }
}