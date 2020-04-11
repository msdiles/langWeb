const mongoose = require('mongoose')
const Schema = mongoose.Schema

const germanSchema = new Schema({
  language:{type:String,default:'german'},
  word: String,
  transcription: String,
  translations: [{ language: String, words: [String] }]
})

module.exports = mongoose.model('german', germanSchema)
