import express from "express";
import { exportAttendance, exportAttendanceByMonth, exportEmp, exportSalaryByMonth } from "../controller/exportData.js";

export const exportdata = express.Router();

exportdata.post('/emp', exportEmp)

exportdata.post('/attendance', exportAttendance)

exportdata.post('/attendance/month', exportAttendanceByMonth)

exportdata.post('/pay', exportSalaryByMonth)

//404
exportdata.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
