import express from "express"
import { getAdminDashboad, getEmpDashboard } from "../controller/dashboard.js";

export const dashboard = express.Router()

dashboard.post('/emp',getEmpDashboard)

dashboard.post('/admin',getAdminDashboad)


//404
dashboard.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});