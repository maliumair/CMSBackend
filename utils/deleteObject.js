const { s3 } = require('../config/s3')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const deleteObject = async (key) => {
  let params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  }

  const command = new DeleteObjectCommand(params)

  try {
    const response = await s3.send(command)
    return response
  } catch (err) {
    return err
  }
}

module.exports = { deleteObject }
