const express = require('express')
const router = express.Router()
const {
  emailValidationRules,
  signUpValidationRules,
  signInValidationRules,
  resetCheckValidationRules,
  resetPasswordValidationRules,
  validate,
} = require('../utils/validator')

const {
  checkEmail,
  signin,
  signup,
  userInfo,
  middlewareJWT,
  refreshTokens,
  logOut,
  resetPassword,
  resetCheck,
  resetGet
} = require('../controllers/profileController.api')

router.post('/email', emailValidationRules(), validate, checkEmail)

router.post('/signin', signInValidationRules(), validate, signin)

router.post('/signup', signUpValidationRules(), validate, signup)

router.post('/refresh', refreshTokens)

router.get('/refresh', middlewareJWT, userInfo)

router.post('/logout', logOut)

router.post('/reset/get', emailValidationRules(), validate, resetGet)

router.post(
  '/reset/check',
  resetCheckValidationRules(),
  validate,
  resetCheck
)

router.post(
  '/reset/password',
  resetPasswordValidationRules(),
  validate,
  resetPassword
)

module.exports = router
