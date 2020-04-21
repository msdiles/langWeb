
const Russian = require('../models/russian')
const English = require('../models/english')
const German = require('../models/german')

const languages = [
  { language: 'english', model: English },
  { language: 'russian', model: Russian },
  { language: 'german', model: German },
]

exports.word_create = (req, res) => {
  const language = req.body.language
  const Model = languages.filter((item) => item.language === language)[0].model
  const wordObject = req.body.word
  Model.countDocuments({ word: wordObject.word }, (err, result) => {
    if (err) res.send({ error: err })
    if (result) {
      res.send({ existed: true, added: false })
    } else {
      Model.create(wordObject, (err, word) => {
        if (err) res.send({ error: err })
        return res.send({ added: true })
      })
    }
  })
}

exports.word_delete = (req, res) => {
  const language = req.body.language
  const Model = languages.filter((item) => item.language === language)[0].model
  const wordId = req.body.id
  Model.findByIdAndDelete({ _id: wordId }, (err, result) => {
    if (err) res.send({ error: err })
    return res.send({ deleted: true })
  })
}

exports.word_update = (req, res) => {
  const language = req.body.language
  const Model = languages.filter((item) => item.language === language)[0].model
  const wordId = req.body.id
  const wordChanges = req.body.word
  Model.findByIdAndUpdate(wordId, wordChanges, (err, result) => {
    if (err) res.send({ error: err })
    return res.send({ updated: true })
  })
}

exports.word_read = (req, res) => {
  const language = req.body.language
  const Model = languages.filter((item) => item.language === language)[0].model
  const word = req.body.word
  Model.findOne({ word: word }, (err, response) => {
    if (err) res.send({ error: err })
    if (response === null) return res.send({ existed: false })
    return res.send({ existed: true, response })
  })
}
