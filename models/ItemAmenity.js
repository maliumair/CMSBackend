module.exports = (sequelize, DataTypes) => {
  const ItemAmenity = sequelize.define('itemAmenities', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  })
  return ItemAmenity
}
