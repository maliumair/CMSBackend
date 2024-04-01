const multer = require('multer')
const multerS3 = require('multer-s3')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const { s3 } = require('../config/s3')
const uploadAWS = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, uniqueSuffix + file.originalname)
    },
  }),
})

module.exports = {
  storage,
  upload,
  uploadAWS,
}
