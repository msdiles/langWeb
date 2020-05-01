const nodemailer = require('nodemailer')
require('dotenv').config()

exports.sendEmail = (recipient) => {
  const transporter = nodemailer.createTransport({
    service: process.env.GMAIL_SERVICE_NAME,
    host: process.env.GMAIL_SERVICE_HOST,
    port: process.env.GMAIL_SERVICE_PORT,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER_NAME,
      pass: process.env.GMAIL_USER_PASSWORD,
    },
  })
  const mailOptions = {
    from: '"LangWeb" <misdalose@gmail.com>',
    to: recipient.email,
    subject: 'Reset password',
    html: `<h4><b>Reset Password</b></h4>
      <p>To reset your password, complete this form:</p>
      <a href="${process.env.CLIENT_URL}/#/reset/${recipient.id}/${recipient.token}">
      ${process.env.CLIENT_URL}/#/reset/${recipient.id}/${recipient.token}</a><br><br>
      <p>LangWeb Team</p>`,
  }

  return new Promise((res, rej) => {
    transporter.verify((error, success) => {
      if (error) {
        rej(error)
      } else {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            rej(error)
          } else res(info)
        })
      }
    })
  })
}
