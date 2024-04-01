module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('dealDocuments', {
    imageLink: {
      type: DataTypes.TEXT,
      required: true,
    },
    imageCaption: {
      type: DataTypes.STRING,
      required: true,
    },
    etag: {
      type: DataTypes.STRING,
      required: true,
    },
  })
  return Document
}
