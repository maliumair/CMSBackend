const transporter = require('../config/mailer')
const path = require('path')
const { regularMail } = require('./resources/regular')
const sendPasswordResetEmail = async (email, userId, token) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Rest Your Password',
    attachments: [
      {
        filename: 'logo-white.png',
        path: path.join(__dirname, 'resources', 'logo-white.png'),
        cid: 'logo',
      },
    ],
    html: regularMail(
      'Reset Your Password',
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

const sendVerificationEmail = async (email, userId, token) => {
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

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
}
