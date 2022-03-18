import express from 'express'
import { login, register } from '../controller/rol.js'

export const rol = express.Router()

//login
rol.post("/login", login)

//register
rol.post("/register", register)

//404
rol.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})