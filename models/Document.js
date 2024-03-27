module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('dealDocuments', {
    imageLink: {
      type: DataTypes.STRING,
      required: true,
    },
    imageCaption: {
      type: DataTypes.STRING,
      required: true,
    },
    imageHash: {
      type: DataTypes.STRING,
      required: true,
    },
  })
  return Document
}
