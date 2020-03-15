require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')

const wordsRouter = require('./routes/wordRoutes')

const app = express()



app.use(logger('dev'))

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to mongodb'))
    .catch(error => console.log(error))

app.use('/api',wordsRouter)

app.listen(5000, () => {
    console.log('App listening on port 5000')
})
