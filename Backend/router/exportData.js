import express from "express";
import { exportAttendance,exportEmp } from "../controller/exportData.js";

export const exportdata = express.Router();

exportdata.post('/emp', exportEmp)

exportdata.post('/attendance', exportAttendance)

//404
exportdata.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
