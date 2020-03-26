const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wordSchema = new Schema({
  russian: String,
  english: [{ type: String }]
})

module.exports = mongoose.model('words', wordSchema)
