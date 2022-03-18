import express from 'express'
import { Employee } from '../model/Employee.js'
export const demo = express.Router()

const path = "./demo"


//demo: returns list of registered users in json form
demo.post("/users/all", async (req, res) => {
    const results = await Employee.find()
    // console.log(results)
    res.send(results)
})

//demo: delete user by email id
demo.get("/users/delete", async (req, res) => {
    const id = req.query.id
	await Employee.deleteOne({_id:id})
	res.redirect("/demo/list")	
})

//demo: homepage
demo.get("/",  (req, res) => {
    res.sendFile("index.html",{root:path})
})


//demo: list of registered users
demo.get("/list", (req, res) => {
    // const results = await Employee.find()
    // console.log(results)
    res.sendFile("list.html",{root:path})
})

//demo: register
demo.get("/add", (req, res) => {
    res.sendFile("register.html",{root:path})
})

//demo: login
demo.get("/login",  (req, res) => {
    res.sendFile("login.html",{root:path})
})

//404
demo.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})