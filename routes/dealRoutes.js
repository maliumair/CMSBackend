const express = require('express')
const router = express.Router()
const dealController = require('../controllers/dealController')
const verifyJWT = require('../middlewares/verifyJWT')

// This applies security to all routes in this router
// router.use(verifyJWT)

router
  .route('/')
  .get(dealController.getAllDeals)
  .post(dealController.createNewDeal)
  .patch(dealController.updateDeal)
  .delete(dealController.deleteDeal)

module.exports = router
