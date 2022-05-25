import express from "express"
import { updatePersonalDetail, getpersonalDetail } from "../controller/personalDetail.js"

export const personalDetail = express.Router()

personalDetail.post('/update', updatePersonalDetail)

personalDetail.post('/get', getpersonalDetail)

//404
personalDetail.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});