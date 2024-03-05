module.exports = (sequelize, DataTypes) => {
  const Nominee = sequelize.define('nominees', {
    firstName: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    relation: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
  })
  return Nominee
}
