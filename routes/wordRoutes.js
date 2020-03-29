const express = require('express')
const router = express.Router()

const main_controller = require('../controllers/mainController')

router.post('/word/create', main_controller.word_create)

router.post('/word/read', main_controller.word_read)

router.put('/word/update', main_controller.word_update)

router.delete('/word/delete', main_controller.word_delete)

module.exports = router
