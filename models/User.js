const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
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
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    cnic: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      defaultValue:
        '$2b$10$7xjXTPwT28Vho5dxiYrgl.RwsvCBOAN17T13Cn2YPELo3vPK0heiC',
      allowNull: false,
    },
    isDefaulter: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'customer'],
      defaultValue: 'customer',
      allowNull: false,
    },
  })

  return User
}
