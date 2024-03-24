const express = require('express')
const router = express.Router()
const unitController = require('../controllers/unitController')
const verifyJWT = require('../middlewares/verifyJWT')

// This applies security to all routes in this router
router.use(verifyJWT)

router
  .route('/')
  .get(unitController.getAllUnits)
  .post(unitController.createNewUnit)
  .patch(unitController.updateUnit)
  .delete(unitController.deleteUnit)

router.get('/:id', unitController.getUnitById)
module.exports = router
