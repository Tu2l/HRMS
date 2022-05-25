import express from "express"
import {
  addPay, getPayDetails, updatePay, getEmpPay
} from "../controller/pay.js"

export const pay = express.Router()

pay.post('/hr/add', addPay)

pay.post('/hr/get', getPayDetails)

pay.post('/hr/update', updatePay)

pay.post('/hr/get/all', getEmpPay)

// pay.post('/update/status/allowance', changeAllowanceStatus)

// pay.post('/get/allowance/all', getAllowanceHistory)

// pay.post('/get/allowance', getAllowance)

pay.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});
