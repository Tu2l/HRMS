import express from "express"
import { rol } from "../router/rol.js"
import { attendance } from "../router/attendance.js"
import { user } from "../router/user.js"
import { leave } from "../router/leave.js"
import { holiday } from "../router/holiday.js"
import { bank } from "../router/bank.js"
import { project } from "../router/project.js"
import { pay } from "../router/pay.js"
import { personalDetail } from "../router/personalDetail.js"
import { address } from "../router/address.js"
import { department } from "../router/department.js"
import { designation } from "../router/designation.js"
import { upload } from "../router/upload.js"
import { office } from "../router/office.js"
import { salary } from "../router/salary.js"
import { importdata } from "./importData.js"
import { exportdata } from "./exportData.js"
import { dashboard } from "./dashboard.js"

export const api = express.Router()

api.use("/rol", rol)

api.use("/user", user)

api.use("/profile", personalDetail)

api.use("/address", address)

api.use("/attendance", attendance)

api.use("/leave", leave)

api.use("/holiday", holiday)

api.use("/bank", bank)

api.use("/project", project)

api.use("/pay", pay)

api.use("/salary", salary)

api.use("/department", department)

api.use("/designation", designation)

api.use("/upload", upload)

api.use("/office", office)

api.use("/import", importdata)

api.use("/export", exportdata)

api.use("/dashboard", dashboard)

//404: wrong path
api.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});