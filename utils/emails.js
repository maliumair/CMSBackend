const transporter = require('../config/mailer')

const sendPasswordResetEmail = async (email, userId, token) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Rest Your Password',
    text:
      'Please click on the link below to reset your password. ' +
      process.env.CLIENT_HOST +
      '/reset_password?token=' +
      token +
      '&uid=' +
      userId,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending Verification email: ', error)
    } else {
      console.log('Verification Email sent: ', info.response)
    }
  })
}

const sendVerificationEmail = async (email, userId, token) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Verify Your Email Address',
    text:
      'Please click on the link below to verify your email address. ' +
      process.env.CLIENT_HOST +
      '/verify_email?token=' +
      token +
      '&uid=' +
      userId,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending Verification email: ', error)
    } else {
      console.log('Password Reset Email sent: ', info.response)
    }
  })
}

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
}
