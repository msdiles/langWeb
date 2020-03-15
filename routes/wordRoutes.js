const express = require('express')
const router = express.Router()

const user_controller = require('../controllers/wordController')

router.post('/word/create', user_controller.word_create)

router.post('/word/read', user_controller.word_read)

router.post('/word/update', user_controller.word_update)

router.post('/word/delete', user_controller.word_delete)

router.get('/TEST', user_controller.TEST)

module.exports = router
