import express from "express"
import { getLeaveHistory, applyLeave, getLeaveDetails, updateCriteria, getLeaveRequests,getLeaveRequestIds, changeStatus } from "../controller/leave.js"

export const leave = express.Router()

leave.post('/apply', applyLeave)

leave.post('/update/status', changeStatus)

leave.post('/get', getLeaveHistory)

leave.post('/get/requests', getLeaveRequests)

leave.post('/get/requests/id', getLeaveRequestIds)

leave.post('/get/details', getLeaveDetails)

leave.post('/hr/update', updateCriteria)

//404
leave.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});
