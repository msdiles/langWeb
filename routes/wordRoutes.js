const express = require('express')
const router = express.Router()

const edit_controller = require('../controllers/editController')
//TODO изменить тип запросов на верный
//TODO добавить валидацию данных
router.post('/create', edit_controller.word_create)

router.post('/read', edit_controller.word_read)

router.put('/update', edit_controller.word_update)

router.delete('/delete', edit_controller.word_delete)

module.exports = router
