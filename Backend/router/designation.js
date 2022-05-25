import express from "express"
import { addDesignation, getAllDesignations, getDesignations, deleteDesignation,updateDesignation ,getDesination, showDesignation} from "../controller/designation.js"

export const designation = express.Router()

designation.post('/get/bycode', getDesination)

designation.post('/get', getDesignations)

designation.post('/get/all', getAllDesignations)

designation.post('/add', addDesignation)

designation.post('/update', updateDesignation)

designation.post('/delete', deleteDesignation)

designation.post('/show', showDesignation)


//404
designation.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});
