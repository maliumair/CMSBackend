module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('items', {
    productCategory: {
      type: DataTypes.ENUM,
      values: ['Society', 'Multistory'],
      defaultValue: 'Multistory',
      allowNull: false,
    },
    itemType: {
      type: DataTypes.ENUM,
      values: ['Apartment', 'Car Park', 'Plot', 'Shop', 'Construction'],
      allowNull: false,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    area: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    unitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    view: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Available',
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lat: {
      type: DataTypes.FLOAT(10, 6),
    },
    lng: {
      type: DataTypes.FLOAT(10, 6),
    },
  })
  return Item
}
