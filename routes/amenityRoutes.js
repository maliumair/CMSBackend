const express = require('express')
const router = express.Router()
const amenityController = require('../controllers/amenityController')
const verifyJWT = require('../middlewares/verifyJWT')

// This applies security to all routes in this router
// router.use(verifyJWT)

router
  .route('/')
  .get(amenityController.getAllAmenities)
  .post(amenityController.createNewAmenity)
  .patch(amenityController.updateAmenity)
  .delete(amenityController.deleteAmenity)

module.exports = router
