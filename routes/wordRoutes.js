const express = require('express')
const router = express.Router()

const user_controller = require('../controllers/wordController')

router.post('/word', user_controller.word_create)

router.get('/word', user_controller.word_read)

router.put('/word', user_controller.word_update)

router.delete('/word', user_controller.word_delete)

router.get('/TEST', user_controller.TEST)

module.exports = router
