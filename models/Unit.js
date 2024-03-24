module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('units', {
    unitName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  })
  return Unit
}
