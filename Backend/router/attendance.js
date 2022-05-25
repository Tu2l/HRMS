import express from "express";
import {
  registerAttendance,
  getAttendance,
  fillForTest,
  byRange,
  getEmpNAttendance
} from "../controller/attendance.js";

export const attendance = express.Router();

//get
attendance.post("/get", getAttendance);

attendance.post("/get/range", byRange);

attendance.post("/get/withdetails", getEmpNAttendance);

//fill db for test
attendance.post("/fillForTest", fillForTest)

//register
attendance.post("/register", registerAttendance);

//404
attendance.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
