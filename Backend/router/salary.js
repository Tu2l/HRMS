import express from "express"
import {
  generateSalary, getSalaryHistory, getSalaryHistoryByMonth,generateSalaryForAll
} from "../controller/salary.js"

export const salary = express.Router()

salary.post('/add', generateSalary)

salary.post('/add/all', generateSalaryForAll)

salary.post('/get', getSalaryHistory)

salary.post('/get/bymonth', getSalaryHistoryByMonth)

salary.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});
