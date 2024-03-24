const express = require('express')
const router = express.Router()
const dealController = require('../controllers/dealController')
const verifyJWT = require('../middlewares/verifyJWT')
const multer = require('multer')
const upload = multer({
  dest: 'uploads/',
})

// This applies security to all routes in this router
router.use(verifyJWT)

router
  .route('/')
  .get(dealController.getAllDeals)
  .post(dealController.createNewDeal)
  .patch(dealController.updateDeal)
  .delete(dealController.deleteDeal)

router.patch(
  '/documents',
  upload.array('image'),
  dealController.updateDealDocuments
)
router.get('/:id', dealController.getDealById)
module.exports = router
