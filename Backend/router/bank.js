import express from "express"
import { addBank, getBankDetails, updateBankDetails } from "../controller/bank.js"

export const bank = express.Router()

bank.post('/add', addBank)

bank.post('/get', getBankDetails)

bank.post('/update', updateBankDetails)

//404
bank.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});