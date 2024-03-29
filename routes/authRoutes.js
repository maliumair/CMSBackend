const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middlewares/loginLimiter')

router.route('/').post(loginLimiter, authController.login)

router.route('/refresh').post(authController.refresh)
router.route('/verify_email').post(authController.verifyEmail)
router
  .route('/resend_verification_link')
  .post(authController.resendVerificationLink)

router.route('/logout').post(authController.logout)

module.exports = router
