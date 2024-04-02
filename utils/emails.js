const transporter = require('../config/mailer')
const path = require('path')
const { regularMail } = require('./resources/regular')
const asyncHandler = require('express-async-handler')
const { dealMail } = require('./resources/deal')
const sendPasswordResetEmail = async (email, userId, lastName, token) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    attachments: [
      {
        filename: 'logo-white.png',
        path: path.join(__dirname, 'resources', 'logo-white.png'),
        cid: 'logo',
      },
    ],
    html: regularMail(
      'Reset Your Password',
      `${lastName}`,
      'Please click on the button below to reset your password.',
      'Reset Password',
      `${process.env.CLIENT_HOST}/reset_password?token=${token}&uid=${userId}`
    ),
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending Password Reset email: ', error)
    } else {
      console.log('Password Reset Email sent: ', info.response)
    }
  })
}

const sendVerificationEmail = async (email, userId, lastName, token) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Verify Your Email Address',
    attachments: [
      {
        filename: 'logo-white.png',
        path: path.join(__dirname, 'resources', 'logo-white.png'),
        cid: 'logo',
      },
    ],
    html: regularMail(
      'Verify Your Email Address',
      `${lastName}`,
      'Please click on the link below to verify your email address.',
      'Verify Email',
      `${process.env.CLIENT_HOST}/verify_email?token=${token}&uid=${userId}`
    ),
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending Verification email: ', error)
    } else {
      console.log('Verification Email sent: ', info.response)
    }
  })
}

const sendDealCreationEmail = async (user, deal, product, installments) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: user.email,
    subject: 'Done Deal!',
    attachments: [
      {
        filename: 'logo-white.png',
        path: path.join(__dirname, 'resources', 'logo-white.png'),
        cid: 'logo',
      },
    ],
    html: dealMail(user, deal, product, installments),
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending Deal Creation email: ', error)
    } else {
      console.log('Deal Creation Email sent: ', info.response)
    }
  })
}

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendDealCreationEmail,
}
