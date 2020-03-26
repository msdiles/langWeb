const Word = require('../models/word')

exports.word_create = (req, res) => {
  const wordIn = {
    russian: req.body.russian,
    english: req.body.english
  }
  const russian = req.body.russian
  const english = req.body.english
  Word.exists(wordIn, (err, result) => {
    if (err) res.send({error:err})
    if (result) {
      res.send({ existed: true })
    } else {
      Word.create({ russian: russian, english: english }, (err, word) => {
        if (err) res.send({error:err})
        return res.send(word)
      })
    }
  })
}

exports.word_delete = (req, res) => {
  const wordId = req.body.id
  Word.findByIdAndDelete({ _id: wordId }, (err, result) => {
    if (err) res.send({error:err})
    return res.send(result)
  })
}

exports.word_update = (req, res) => {
  const wordId = req.body.id
  const wordChanges = req.body.changes
  Word.findByIdAndUpdate(wordId, wordChanges, (err, result) => {
    if (err) res.send({error:err})
    console.log(result)
    return res.send(result)
  })
}

exports.word_read = (req, res) => {
  const word = req.body.word
  if (/[a-z]/i.test(word)) {
    Word.findOne({ english: word }, (err, words) => {
      console.log(word)
      if (err) res.send({error:err})
      if (words === null) return res.send({ existed: false })
      return res.send(words)
    })
  } else {
    Word.findOne({ russian: word }, (err, words) => {
      console.log(words)
      if (err) res.send({error:err})
      if (words === null) return res.send({ existed: false })
      return res.send(words)
    })
  }
}

exports.TEST = (req, res) => {
  res.send({ asdsd: 'asdasd' })
}
