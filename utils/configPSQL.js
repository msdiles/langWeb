require('dotenv').config()

const { Pool } = require('pg')
const isProduction = process.env.NODE.ENV === 'production'

const connectionString = `postgres://${process.env.SQL_USER}:${process.env.SQL_PASSWORD}@${process.env.SQL_HOST}:${process.env.SQL_PORT}/${process.env.SQL_DATABASE}`

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
})

module.exports = { pool }
