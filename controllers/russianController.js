const Russian = require('../models/english')

exports.word_create = (req, res) => {
  const wordIn = {
    word: req.body.word,
    transcription: req.body.transcription,
    translations: req.body.translations
  }
  Russian.exists(wordIn, (err, result) => {
    if (err) res.send({ error: err })
    if (result) {
      res.send({ existed: true })
    } else {
      Russian.create(wordIn, (err, word) => {
        if (err) res.send({ error: err })
        return res.send(word)
      })
    }
  })
}

exports.word_delete = (req, res) => {
  const wordId = req.body.id
  Russian.findByIdAndDelete({ _id: wordId }, (err, result) => {
    if (err) res.send({ error: err })
    return res.send(result)
  })
}

exports.word_update = (req, res) => {
  const wordId = req.body.id
  const wordChanges = req.body.changes
  Russian.findByIdAndUpdate(wordId, wordChanges, (err, result) => {
    if (err) res.send({ error: err })
    console.log(result)
    return res.send(result)
  })
}

exports.word_read = (req, res) => {
  const word = req.body.word
  Russian.findOne({ word: word }, (err, words) => {
    console.log(word)
    if (err) res.send({ error: err })
    if (words === null) return res.send({ existed: false })
    return res.send(words)
  })
}