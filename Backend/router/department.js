import express from "express"
import { addDepartment, getAllDepartments, getDepartments, deleteDepartment, updateDepartment ,getDepartment} from "../controller/department.js"

export const department = express.Router()

department.post('/get/bycode', getDepartment)

department.post('/get', getDepartments)

department.post('/get/all', getAllDepartments)

department.post('/add', addDepartment)

department.post('/update', updateDepartment)

department.post('/delete', deleteDepartment)


//404
department.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});
