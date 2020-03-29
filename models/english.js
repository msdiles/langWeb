const mongoose = require('mongoose')
const Schema = mongoose.Schema

const englishSchema = new Schema({
  word: String,
  transcription: String,
  translations: [{ language: String, words: [String] }]
})

module.exports = mongoose.model('english', englishSchema)
