const express = require('express')
const router = express.Router()
const {
  emailValidationRules,
  signUpValidationRules,
  signInValidationRules,
  validate,
} = require('../utils/validator')

const {
  checkEmail,
  signin,
  signup,
  userInfo,
  middlewareJWT,
  refreshTokens,
  logOut
} = require('../controllers/profileController.api')

router.post('/email', emailValidationRules(), validate, checkEmail)

router.post('/signin', signInValidationRules(), validate, signin)

router.post('/signup', signUpValidationRules(), validate, signup)

router.post('/refresh', refreshTokens)

router.get('/refresh', middlewareJWT, userInfo)

router.post('/logout',logOut)

module.exports = router
