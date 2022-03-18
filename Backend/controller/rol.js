import { Employee } from "../model/Employee.js"
import crypto from 'crypto'


//login
export const login = async (req, res) => {
    const out = {}
    try {
        //checking if the an employee exist with the email id
        const userCheck = await Employee.find({
            $and: [
                { email: { $exists: true } },
                { email: req.body.email }
            ]
        },[]).limit(1)
        
        if (userCheck.length > 0) {
            const emp = userCheck[0]
            //passsword checking
            //hashing plain  text password
            const hash = crypto.createHmac('sha256', req.body.email).update(req.body.password).digest('hex')
            if (hash.toString().localeCompare(emp.password) === 0) {
                out.message = "success"
                out.error = false
                out.data = emp
            } else
                throw Error("Wrong password")
        } else
            throw Error("User not found")

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}


//register
export const register = async (req, res) => {
    const out = {}
    try {
        /*generating emp_id based on last emp_id if there is no employee exist then 1 will be used as default emp_id
        emp_id format : GT/[Serial Number]/[Last two digit of the current year]
        */
        const last_emp = await Employee.find().sort({ _id: -1 }).limit(1);
        var num = 1
        if (last_emp.length > 0) {
            num = parseInt(last_emp[0].emp_id.split("/")[1])
            num += 1
        }
        const date = new Date();
        let year = date.getFullYear();
        const emp_id = "GT/" + (num <= 9 ? "000" + num : num <= 99 ? "00" + num : num <= 999 ? "0" + num : num) + "/" + year.toString().substring(2)

        //hashing plain  text password
        const hash = crypto.createHmac('sha256', req.body.email).update(req.body.password).digest('hex')


        //checking if the an employee already exist with the same email id
        const userCheck = await Employee.find({
            $and: [
                { email: { $exists: true } },
                { email: req.body.email }
            ]
        }, [req.body.email]).limit(1)
        // console.log(userCheck)

        if (userCheck.length > 0)
            throw Error("Email already registered")

        const emp = new Employee({
            emp_id: emp_id.toString(),
            email: req.body.email,
            password: hash,
            name: req.body.name,
            phone: req.body.phone,
            dob: req.body.dob,
            designation: req.body.designation,
            department: req.body.department
        })

        await emp.save()
        out.message = "success"
        out.error = false
        out.data = emp

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}