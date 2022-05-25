import express from "express";
import { importEmp,importPay } from "../controller/importData.js";

export const importdata = express.Router();

importdata.post('/emp', importEmp)

importdata.post('/pay', importPay)

//404
importdata.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
