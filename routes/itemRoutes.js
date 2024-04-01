const express = require('express')
const router = express.Router()
const itemController = require('../controllers/itemController')
const verifyJWT = require('../middlewares/verifyJWT')
const { upload, uploadAWS } = require('../middlewares/multer')

// This applies security to all routes in this router
// router.use(verifyJWT)

router
  .route('/')
  .get(itemController.getAllItems)
  .post(uploadAWS.array('images'), itemController.createNewItem)
  .patch(uploadAWS.array('images'), itemController.updateItem)
  .delete(itemController.deleteItem)

router.get('/:id', itemController.getItemById)

module.exports = router
