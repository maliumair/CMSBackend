const { addMonths } = require('date-fns')

module.exports = (sequelize, DataTypes) => {
  const Deal = sequelize.define('deals', {
    productType: {
      type: DataTypes.ENUM,
      values: ['Shop', 'Apartment', 'Car Park', 'Plot', 'Other'],
      defaultValue: 'Other',
      required: true,
      allowNull: false,
    },

    measuringUnit: {
      type: DataTypes.ENUM,
      values: ['Marla', 'Sq. ft'],
      defaultValue: 'Sq. ft',
      allowNull: false,
      required: true,
    },
    totalArea: {
      type: DataTypes.DOUBLE,
      required: true,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DOUBLE,
      required: true,
      allowNull: false,
    },

    totalPrice: {
      type: DataTypes.DOUBLE,
      required: true,
      allowNull: false,
    },
    commissionPercentage: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    commissionFixed: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    totalCommission: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    discountPercentage: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    discountFixed: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    totalDiscount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    dealType: {
      type: DataTypes.ENUM,
      values: ['Installments', 'Lump Sum'],
      defaultValue: 'Installments',
      allowNull: false,
      required: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    bookingPercentage: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    bookingAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    bookingPaid: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    confirmationPercentage: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    confirmationAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    confirmationPaid: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    confirmationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: addMonths(Date.now(), 2),
    },
    terminalPercentage: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    terminalFixed: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    totalTerminal: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
  })
  return Deal
}
