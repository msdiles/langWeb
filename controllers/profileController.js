require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { pool } = require('../utils/configPSQL')

//if user not exist add them to database
exports.registerUser = (login, email, hashedPassword) => {
  return new Promise((res, rej) => {
    this.isUserExist(email).then((emailExist) => {
      emailExist === true
        ? rej('User exist')
        : pool
            .query(
              'INSERT INTO users (username,email,password) VALUES ($1,$2,$3) ON CONFLICT ON CONSTRAINT email_is_uniq DO NOTHING',
              [login, email, hashedPassword]
            )
            .then(() => {
              res()
            })
            .catch((err) => {
              rej(err)
            })
    })
  })
}

//check is user exist in database
exports.isUserExist = (email) => {
  return new Promise((res, rej) => {
    pool
      .query('SELECT count(*) FROM users WHERE email=$1', [email])
      .then((userData) => {
        ;+userData.rows[0].count === 0 ? res(false) : res(true)
      })
      .catch((err) => rej(err))
  })
}

//check is password from request equal password fro database
exports.checkPassword = (email, password) => {
  return new Promise((res1, rej1) => {
    pool
      .query('SELECT * FROM users WHERE email=$1', [email])
      .then((userData) => {
        const user = userData.rows[0]
        if (!user) return rej1('Invalid password or email')
        const tokenData = {
          id: user.user_id,
          username: user.username,
        }
        return new Promise((res2, rej2) => {
          bcrypt
            .compare(password, user.password)
            .then((success) => {
              res1({ success, tokenData })
            })
            .catch((err) => rej2(err))
        })
      })
      .catch((err) => rej1(err))
  })
}

//create access token
exports.createAccessToken = (payload) => {
  return new Promise((res, rej) => {
    this.asyncSign({ user: payload }, process.env.ACCESS_SECRET_KEY, {
      expiresIn: '30m',
    })
      .then((token) => {
        res(token)
      })
      .catch((err) => rej(err))
  })
}

//create refresh token
exports.createRefreshToken = (payload, fingerprint) => {
  //count number of sessions for user
  const countSessionsFromDatabase = () => {
    return new Promise((res, rej) => {
      pool
        .query('SELECT count(*) FROM sessions WHERE user_id = $1', [payload.id])
        .then((result) => res(result))
        .catch((err) => rej(err))
    })
  }

  //delete sessions if number sessions > 5
  const deleteSessions = (result) => {
    return new Promise((res, rej) => {
      if (result.rows[0].count >= 5) {
        pool
          .query('Delete  FROM sessions WHERE user_id= $1', [payload.id])
          .then(() => res())
          .catch((err) => rej(err))
      } else return res()
    })
  }

  //create refresh token
  const signJWT = () => {
    return new Promise((res, rej) => {
      this.asyncSign({ user: payload }, process.env.REFRESH_SECRET_KEY, {
        expiresIn: '60d',
      })
        .then((token) => res(token))
        .catch((err) => rej(err))
    })
  }

  //insert in database new session
  const insertSessions = (token) => {
    return new Promise((res, rej) => {
      pool
        .query(
          'INSERT INTO sessions (refresh_token,fingerprint,user_id) VALUES ($1,$2,(SELECT user_id from users WHERE users.user_id = $3)) ',
          [token, fingerprint, payload.id]
        )
        .then(() => res(token))
        .catch((err) => rej(err))
    })
  }

  return new Promise((res, rej) => {
    countSessionsFromDatabase()
      .then((result) => deleteSessions(result))
      .then(() => signJWT())
      .then((token) => insertSessions(token))
      .then((token) => res(token))
      .catch((err) => rej(err))
  })
}

//get user from database through token
exports.getInfoAboutUser = (token) => {
  return new Promise((res, rej) => {
    pool
      .query(
        'SELECT u.* FROM users u WHERE u.user_id =  (SELECT s.user_id FROM sessions s WHERE s.refresh_token = $1) ',
        [token]
      )
      .then((userData) =>
        res({
          id: userData.rows[0].user_id,
          username: userData.rows[0].username,
        })
      )
      .catch((err) => rej(err))
  })
}

//get sessions from database through user id
exports.getSessionsForUser = (userData) => {
  return new Promise((res, rej) => {
    pool
      .query('SELECT * FROM sessions WHERE user_id = $1', [userData.id])

      .then((sessions) => res(sessions.rows))
      .catch((err) => rej(err))
  })
}

//get access and refresh tokens if there is refresh token in database
exports.requestTokens = (userData, sessions, oldToken,fingerprint) => {
  return new Promise((res, rej) => {
    if (sessions.length === 0) {
      rej('There is no token')
    }
    currentToken = sessions.filter((item) => item.refresh_token === oldToken && item.fingerprint ===fingerprint )
    if (!currentToken) {
      rej('Token is wrong')

    }
    Promise.all([
      this.createAccessToken(userData),
      this.updateRefreshToken(userData, oldToken),
    ])
      .then((tokens) => res(tokens))
      .catch((err) => rej(err))
  })
}

//update refresh token
exports.updateRefreshToken = (userData, token) => {
  return new Promise((res, rej) => {
    pool
      .query('Delete FROM sessions WHERE refresh_token=$1', [token])
      .then(() => this.createRefreshToken(userData))
      .then((token) => res(token))
      .catch((err) => rej(err))
  })
}

//promise jwt sign
exports.asyncSign = (data, secret, expiresIn) => {
  return new Promise((res, rej) => {
    jwt.sign(data, secret, expiresIn, (err, token) => {
      if (err) rej(err)
      else {
        res(token)
      }
    })
  })
}

//promise jwt verify
exports.asyncVerify = (token, secret) => {
  return new Promise((res, rej) => {
    jwt.verify(token, secret, (err, tokenData) => {
      if (err) return rej(err)
      return res(tokenData)
    })
  })
}
