const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wordSchema = new Schema({
  russian: String,
  english: String
})

module.exports = mongoose.model('words', wordSchema)
