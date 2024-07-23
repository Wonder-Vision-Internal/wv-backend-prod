#!/usr/bin/env node
const mongoose = require('mongoose')
const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')
const cors = require('cors')

app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.use(express.static(path.join(__dirname,'public')))

const adminrouter = require('./routes/admin')
const frontrouter = require('./routes/front')
app.use(adminrouter)
app.use(frontrouter)

const port = process.env.PORT || 4000




mongoose.connect(process.env.DATABASE_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => {
        app.listen(port, () => {
            console.log('DB is connected')
            console.log(`http://localhost:${port}`)
        })
    }).catch((err) => {
        console.log('Error in connecting Database', err)
    })
