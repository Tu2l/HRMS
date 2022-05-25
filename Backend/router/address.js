import express from "express"
import { updateAddress, getAddress } from "../controller/address.js"

export const address = express.Router()

address.post('/update', updateAddress)

address.post('/get/', getAddress)


//404
address.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});