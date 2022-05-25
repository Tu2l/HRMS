import { Employee } from "../model/Employee.js"
import { PersonalDetail } from "../model/PersonalDetail.js"

// get Personal Details
export const getpersonalDetail = async (req, res) => {
    const out = {}
    try {
        const emp_id = req.body.emp_id
        if (!emp_id)
            throw Error("emp_id is required")

        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
        if (emp_check == 0)
            throw Error("Invalid emp_id")

        const personalCheck = await PersonalDetail.findOne({ emp_id: emp_id })

        out.message = "success"
        out.error = false
        out.data = personalCheck

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

// Update Personal details
export const updatePersonalDetail = async (req, res) => {
    const out = {}
    try {
        const value = {}
        const emp_id = req.body.emp_id

        if (!emp_id)
            throw Error("Employee id required!")

        const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
        if (emp_check == 0)
            throw Error("Invalid emp_id")

        value.emp_id = emp_id

        if (req.body.qualification)
            value.qualification = req.body.qualification

        if (req.body.father_name)
            value.father_name = req.body.father_name

        if (req.body.gender)
            value.gender = req.body.gender

        if (req.body.marital)
            value.marital = req.body.marital

        if (req.body.aadhar_number)
            value.aadhar_number = req.body.aadhar_number


        const profile_check = await PersonalDetail.findOne({ emp_id: emp_id })
        var result = {}
        if (!profile_check) {
            result = new PersonalDetail(value)
            await result.save()
            // console.log("SAVE")
        }
        else {
            result = await PersonalDetail.updateOne({ emp_id: emp_id }, { $set: value })
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
