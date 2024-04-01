const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    accessKeyId: process.env.S3_ACCESS_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
})

s3.d

module.exports = { s3 }
