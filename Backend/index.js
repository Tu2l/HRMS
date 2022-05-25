import express from "express"
import { connection } from "./connection.js"
import { demo } from "./router/demo.js"
import { api } from "./router/_api.js"
import cors from "cors"
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'

const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.static(path.join(__dirname, './build')))

app.use(fileUpload({
  createParentPath: true
}));

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  cors({
    origin: "*",
    methods: ["POST"],
  })
)

// When successfully connected
connection.on("connected", () => {
  app.listen(PORT, () => {
    console.log("Server started: localhost:" + PORT)
  })
})

// If the connection throws an error
connection.on("error", (err) => {
  console.log("Mongoose default connection error: " + err)
})

// When the connection is disconnected
connection.on("disconnected", () => {
  console.log("Mongoose default connection disconnected")
  process.exit(0)
})

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  connection.close(() => {
    console.log("Mongoose connection disconnected through app termination")
    process.exit(0)
  })
})


//demo: for testing purpose only
app.use("/demo", demo)


//api: for api
app.use("/api", api)


//frontend
app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, './build/index.html'))
})

