require('dotenv').config()
const { pool } = require('../utils/config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10

//TODOдобавить xxs защиту
//TODOпривести все респонсы к единому виду и добавить статусы
//TODO изменить струтуру данных в респонсах
//TODO добавить middleware для провекри токена
//TODO добавить в структуру аутенфикации refresh tokken
exports.checkEmail = (req, res) => {
  const { email } = req.body
  pool.query(
    'SELECT count(*) FROM users WHERE email=$1',
    [email],
    (err, userDatas) => {
      if (err) res.send({ errors: err })
      else {
        ;+userDatas.rows[0].count === 0
          ? res.send({ existed: false })
          : res.send({ existed: true })
      }
    }
  )
}

exports.signin = (req, res) => {
  const { email, password } = req.body
  console.log(email, password)
  pool.query(
    'SELECT * FROM users WHERE email =$1 ',
    [email],
    (err, userData) => {
      if (err) res.send({ errors: err })
      else {
        const user = userData.rows[0]
        bcrypt.compare(password, user.password, (err, userData) => {
          console.log(err, userData)
          if (err) {
            return res.status(502).send({ existed: false })
          } else {
            const token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET_KEY)
            if (userData)
              res.status(200).send({
                user: { id: user.id, username: user.username },
                token: token,
                success: true,
              })
            else {
              res.status(404).send({
                token: null,
                message: 'Invalid password or email',
                success: false,
              })
            }
          }
        })
      }
    }
  )
}

exports.signup = (req, res) => {
  const { login, email, password } = req.body

  console.log(login, email, password)
  hashedPassword = bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) console.log(err)
    else {
      console.log(hashedPassword)
      hashedPassword &&
        pool.query(
          'INSERT INTO users (username,email,password) VALUES ($1,$2,$3) ON CONFLICT ON CONSTRAINT email_is_uniq DO NOTHING',
          [login, email, hashedPassword],
          (err, userDatas) => {
            if (err) {
              res.send({ errors: err })
            } else {
              res.send({ signup: true })
            }
          }
        )
    }
  })
}

exports.refresh = (req, res) => {
  let token = req.headers['authorization']
  if (typeof token !== 'undefined') {
    const bearer = token.split(' ')
    token = bearer[1]
    if (!token) res.status(401).send({ error: { message: 'Muss be token' } })
    jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, userData) => {
      if (err) res.status(502).send({ error: { message: `${err}` } })
      res.status(200).send({ user: userData })
    })
  }
}
