const { check, validationResult } = require('express-validator')

const emailValidationRules = () => {
  return [
    check('email')
      .not()
      .isEmpty()
      .isEmail()
      .isLength({ min: 5, max: 255 })
      .trim(),
  ]
}

const signUpValidationRules = () => {
  return [
    check('login').not().isEmpty().isLength({ min: 3, max: 255 }).trim(),
    check('email')
      .not()
      .isEmpty()
      .isEmail()
      .isLength({ min: 5, max: 255 })
      .trim(),
    check('password').not().isEmpty().isLength({ min: 5, max: 255 }).trim(),
  ]
}

const signInValidationRules = () => {
  return [
    check('email')
      .not()
      .isEmpty()
      .isEmail()
      .isLength({ min: 5, max: 255 })
      .trim(),
    check('password').not().isEmpty().isLength({ min: 5, max: 255 }).trim(),
  ]
}


const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}


module.exports = {
  emailValidationRules,
  signUpValidationRules,
  signInValidationRules,
  validate,
}
