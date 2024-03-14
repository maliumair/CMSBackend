const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middlewares/verifyJWT')

// This applies security to all routes in this router
//router.use(verifyJWT)

router
  .route('/')
  .get(verifyJWT, userController.getAllUsers)
  .post(userController.createNewUser)
  .patch(verifyJWT, userController.updateUser)
  .delete(verifyJWT, userController.deleteUser)

router.patch('/approve', verifyJWT, userController.approveUser)
router.patch('/active', verifyJWT, userController.toggleActiveUser)
router.post('/forgot_password', userController.forgotPassword)
router.post('/reset_password', userController.resetPassword)
module.exports = router
