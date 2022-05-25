import express from "express"
import { getHolidayHistory, addHoliday,addHolidayRange, deleteHoliday  } from "../controller/holiday.js"

export const holiday = express.Router()

holiday.post('/get', getHolidayHistory)

holiday.post('/add', addHoliday)

holiday.post('/add/range', addHolidayRange)

holiday.post('/delete', deleteHoliday)


//404
holiday.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});
