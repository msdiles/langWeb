require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
//добавить API ключ на все запросы
const wordsRouter = require('./routes/wordRoutes')
const profileRouter = require('./routes/profileRoutes')
const app = express()
//TODO добавить http коды на все респонсы
const isProduction = process.env.NODE_ENV === 'production'
const origin = { origin: isProduction ? 'будущий адрес ' : '*' }

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
})

app.use(compression())
app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(origin))

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connected to mongodb'))
  .catch((error) => console.log(error))

app.use('/api/word',limiter, wordsRouter)
app.use('/api/profile',limiter, profileRouter)


app.listen(5000, () => {
  console.log('App listening on port 5000')
})
