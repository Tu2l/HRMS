import express from 'express'
import { connection } from './connection.js'
import { demo } from './router/demo.js'
import { rol } from './router/rol.js'

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || 3000

const app = express()
app.use(express.static(path.join(__dirname, './demo')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// CONNECTION EVENTS
// When successfully connected
connection.on('connected', () => {
    app.listen(PORT, () => {
        console.log("Server started: localhost:" + PORT)
    })
});

// If the connection throws an error
connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err)
});

// When the connection is disconnected
connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected')
    process.exit(0)
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', () => {
    connection.close(() => {
        console.log('Mongoose connection disconnected through app termination')
        process.exit(0)
    });
});

/*
    employee login and register
    ROL -> Register or Login
*/
app.use('/api/rol', rol)

//demo: for testing purpose only
app.use('/demo', demo)

/*
handle 404 path not found
*/
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})