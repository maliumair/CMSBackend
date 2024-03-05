module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('addresses', {
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Permanent', 'Mailing'],
      allowNull: false,
    },
  })

  return Address
}
