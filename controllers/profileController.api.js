require('dotenv').config()
const { pool } = require('../utils/configPSQL')
const bcrypt = require('bcrypt')

const {
  registerUser,
  isUserExist,
  createAccessToken,
  createRefreshToken,
  checkPassword,
  asyncVerify,
  getInfoAboutUserThroughToken,
  getSessionsForUser,
  requestTokens,
  createResetPasswordURL,
  checkResetToken,
  changePassword,
} = require('./profileController')

const { sendEmail } = require('../utils/email')
const saltRounds = 10

//check is email in database
exports.checkEmail = (req, res) => {
  const { email } = req.body
  isUserExist(email)
    .then((emailExist) => res.status(200).send({ success: emailExist }))
    .catch((err) => res.status(500).send({ error: err }))
}

//sign up user
exports.signup = (req, res) => {
  const { login, email, password } = req.body
  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => registerUser(login, email, hashedPassword))
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => res.status(500).send({ error: err }))
}

//sign in user
exports.signin = (req, res) => {
  const { email, password, fingerprint } = req.body
  checkPassword(email, password)
    .then(({ success, tokenData }) => {
      if (!success)
        res.status(200).send({
          accessToken: null,
          refreshToken: null,
          success: false,
        })
      else {
        Promise.all([
          createAccessToken(tokenData),
          createRefreshToken(tokenData, fingerprint),
        ])
          .then((values) => {
            res.status(200).send({
              user: { ...tokenData },
              accessToken: values[0],
              refreshToken: values[1],
              success: true,
            })
          })
          .catch((err) => res.status(500).send({ error: err }))
      }
    })
    .catch((err) => res.status(403).send({ error: err }))
}

//refresh access and refresh tokens
exports.refreshTokens = (req, res) => {
  const { token, fingerprint } = req.body
  if (token) {
    asyncVerify(token, process.env.REFRESH_SECRET_KEY)
      .then(() => getInfoAboutUserThroughToken(token))
      .then((userData) => {
        return Promise.all([userData, getSessionsForUser(userData)])
      })
      .then((result) => {
        return requestTokens(result[0], result[1], token, fingerprint)
      })
      .then((tokens) =>
        res.send({
          accessToken: tokens[0],
          refreshToken: tokens[1],
          success: true,
        })
      )
      .catch((err) => res.status(403).send({ error: err }))
  } else {
    res.status(403).send({ success: false, error: 'Access is forbidden' })
  }
}

//response user info
exports.userInfo = (req, res) => {
  res.send({ result: { ...req.user }, success: true })
}

//middleware for check access token
exports.middlewareJWT = (req, res, next) => {
  const header = req.headers['authorization']

  if (typeof header !== 'undefined') {
    const bearer = header.split(' ')
    const token = bearer[1]
    if (token) {
      asyncVerify(token, process.env.ACCESS_SECRET_KEY)
        .then((userData) => {
          req.user = userData
          next()
        })
        .catch((err) => res.status(401).send({ success: false, error: err }))
    }
  } else {
    res.status(401).send({ success: false, error: 'Token is invalid' })
  }
}

//log out user
exports.logOut = (req, res) => {
  token = req.body.refreshToken
  if (token) {
    pool
      .query('DELETE FROM sessions WHERE refresh_token =$1', [token])
      .then(res.status(200).send({ success: true }))
      .catch((err) => res.send(err))
  } else {
    res.send('There is no token')
  }
}

//reset password
exports.resetGet = (req, res) => {
  const email = req.body.email

  isUserExist(email)
    .then((isExist) => {
      res.status(202).send({ success: isExist })
      createResetPasswordURL(email)
    })
    .catch((err) => res.status(500).send({ error: err }))
}

exports.resetCheck = (req, res) => {
  const { id, token } = req.body
  checkResetToken(id, token)
    .then((isToken) => {
      if (!isToken) throw new Error('notExist')
      else return asyncVerify(token, process.env.ACCESS_SECRET_KEY)
    })
    .then(() => res.status(200).send({ result: 'success' }))
    .catch((err) => {
      if (err.message === 'jwt expired')
        return res.status(403).send({ result: 'tokenExpired' })
      if (err.message === 'notExist')
        return res.status(404).send({ result: 'notExist' })
      return res.status(500).send({ error: err })
    })
}

exports.resetPassword = (req, res) => {
  const { id, token, password } = req.body

  checkResetToken(id, token)
    .then((isToken) => {
      if (!isToken) throw new Error('notExist')
      else return asyncVerify(token, process.env.ACCESS_SECRET_KEY)
    })
    .then(() => bcrypt.hash(password, saltRounds))
    .then((hashedPassword) => changePassword(hashedPassword, id, token))
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => {
      if (err.message === 'jwt expired')
        return res.status(403).send({ success: 'tokenExpired' })
      if (err.message === 'notExist')
        return res.status(404).send({ success: 'notExist' })
      return res.status(500).send({ error: err })
    })
}
