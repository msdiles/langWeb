const englishController = require('./englishController')
const russianController = require('./russianController')

exports.word_create = (req, res) => {
  const language = req.body.language
  if (language === 'english') {
    return englishController.word_create(req, res)
  }
  if (language === 'russian') {
    return russianController.word_create(req, res)
  }
}

exports.word_read = (req, res) => {
  const language = req.body.language
  if (language === 'english') {
    return englishController.word_read(req, res)
  }
  if (language === 'russian') {
    return russianController.word_read(req, res)
  }
}

exports.word_update = (req, res) => {
  const language = req.body.language
  if (language === 'english') {
    return englishController.word_update(req, res)
  }
  if (language === 'russian') {
    return russianController.word_update(req, res)
  }
}

exports.word_delete = (req, res) => {
  const language = req.body.language
  if (language === 'english') {
    return englishController.word_delete(req, res)
  }
  if (language === 'russian') {
    return russianController.word_delete(req, res)
  }
}
