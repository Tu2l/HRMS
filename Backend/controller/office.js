import { Address } from "../model/Address.js"
import { Employee } from "../model/Employee.js"
import { Office } from "../model/Office.js"

//Add Office
export const addOffice = async (req,res) =>{
    const out = {}
    try {
        var { name } = req.body

    //Checking for fill up
    if (!name )
        return Error("Name is missing!")
    
        const nameCheck = await Office.find({
            $and: [
                { name: { $exists: true } },
                { name: name }
            ]
        }).countDocuments()

    if(nameCheck)
       throw Error("Office already added!")


       const value = {}

        value.emp_id = ''

        if (!req.body.address) throw Error ("Address is required!")
        value.address = req.body.address

        if (req.body.city) throw Error ("City is required!")
        value.city = req.body.city

        if (req.body.district) throw Error ("District is required!")
        value.district = req.body.district

        if (req.body.block) throw Error ("Block is required!")
        value.block = req.body.block

        if (req.body.state) throw Error ("State is required!")
        value.state = req.body.state

        if (req.body.phone) throw Error ("Phone is required!")
        value.phone = req.body.phone

        if (req.body.zip_code) throw Error ("Zip Code is required!")
        value.zip_code = req.body.zip_code

    const office = new Office({
        name: name,
        location: value
    })

        await office.save()
        out.message = "success"
        out.error = false
        out.data = office
        
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

//get Office
export const getOffice = async (req,res) =>{
    const out = {}
    try {
          
        out.message = "success"
        out.error = false
        out.data = await Office.find({}, ['name']).sort({ name: "asc" })

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

//Update Office
export const updateOffice = async (req, res) => {
    const out = {}
    try {
        const id = req.body.id
        if (!id) throw Error("Id is required!")

        const value = {}

        if (req.body.name)
        value.name = req.body.name

        value.emp_id = ''

        if (!req.body.address) throw Error ("Address is required!")
        value.address = req.body.address

        if (req.body.city) throw Error ("City is required!")
        value.city = req.body.city

        if (req.body.district) throw Error ("District is required!")
        value.district = req.body.district

        if (req.body.block) throw Error ("Block is required!")
        value.block = req.body.block

        if (req.body.state) throw Error ("State is required!")
        value.state = req.body.state

        if (req.body.phone) throw Error ("Phone is required!")
        value.phone = req.body.phone

        if (req.body.zip_code) throw Error ("Zip Code is required!")
        value.zip_code = req.body.zip_code

        out.message = "success"
        out.error = false
        out.data = await Office.updateOne({ _id: id }, { $set: update })

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

//Add Employees in Office
export const addEmployee = async (req, res) => {
    const out = {}
    try {
        const id = req.body.id
        if (!id) throw Error("Employee id is required")

        const employee_list = req.body.employee
        if (!employee_list && !Array.isArray(employee_list))
            throw Error("new employee array is required")

        for (var i = 0; i < employee_list.length; i++)
            if (employee_list[i])
                if (await Employee.find({ emp_id: employee_list[i] }).countDocuments() == 0)
                    throw Error(employee_list[i].emp_id + ' is invalid')

        out.message = "success"
        out.error = false
        out.data = await Office.updateOne({ _id: id }, { $set: { emp_list: employee_list } })
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

//Remove Office Employee
export const removeEmployee = async (req, res) => {
    const out = {}
    try {
        const id = req.body.id
        if (!id) throw Error("Project Id is required")

        const employees = req.body.employees
        if (!employees && !Array.isArray(employees))
            throw Error("new members array is required")

        const employeeList = await Office.findOne({ _id: id }, ["emp_list"])
        for (var i = 0; i < employees.length; i++)
            for (var j = 0; j <employeeList.length; j++)
                if (employees[i] === employeeList[j])
                employeeList.employees.splice(j, 1)

        // console.log(employee.members)
        out.message = "success"
        out.error = false
        out.data = await Office.updateOne({ _id: id }, { $set: { emp_list: employeeList } })
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}