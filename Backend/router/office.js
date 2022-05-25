import express from "express"
import { addOffice, getOffice, updateOffice, addEmployee, removeEmployee } from "../controller/office.js"

export const office = express.Router()

//Office
office.post('/add', addOffice)
office.post('/get', getOffice)
office.post('/update', updateOffice)

//employees
office.post('/add/employee', addEmployee)
office.post('/remove/employee', removeEmployee)

//404
office.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});