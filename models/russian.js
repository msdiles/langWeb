const mongoose = require('mongoose')
const Schema = mongoose.Schema

const russianSchema = new Schema({
  language:{type:String,default:'russian'},
  word: String,
  transcription: String,
  translations: [{ language: String, words: [String] }]
})

module.exports = mongoose.model('russian', russianSchema)
