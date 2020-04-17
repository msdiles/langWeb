const express = require('express')
const router = express.Router()
const {
  emailValidationRules,
  signUpValidationRules,
  signInValidationRules,
  validate,
} = require('../utils/validator')

const profile_controller = require('../controllers/profileController')
//TODO изменить тип запросов на верный
router.post(
  '/email',
  emailValidationRules(),
  validate,
  profile_controller.checkEmail
)

router.post(
  '/signin',
  signInValidationRules(),
  validate,
  profile_controller.signin
)

router.post(
  '/signup',
  signUpValidationRules(),
  validate,
  profile_controller.signup
)

router.get('/refresh', profile_controller.refresh)

module.exports = router
