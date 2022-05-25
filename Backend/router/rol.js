import express from 'express'
import { login, register, changeServiceStatus, changePassword } from '../controller/rol.js'

export const rol = express.Router()

//login
rol.post("/login", login)

//register
rol.post("/register", register)

//change employee service status
rol.post("/status", changeServiceStatus)

//Change password
rol.post("/change/password", changePassword)

//404
rol.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})