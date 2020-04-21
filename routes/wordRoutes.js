const express = require('express')
const router = express.Router()
const { middlewareJWT } = require('../controllers/profileController.api')

const edit_controller = require('../controllers/editController')

router.post('/create', middlewareJWT, edit_controller.word_create)

router.post('/read', edit_controller.word_read)

router.put('/update', middlewareJWT, edit_controller.word_update)

router.delete('/delete', middlewareJWT, edit_controller.word_delete)

module.exports = router
