const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middlewares/loginLimiter')

router.route('/').post(loginLimiter, authController.login)

router.route('/refresh').get(authController.refresh)
router.route('/verify_email').post(authController.verifyEmail)

router.route('/logout').post(authController.logout)

module.exports = router
