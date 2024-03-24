module.exports = (sequelize, DataTypes) => {
  const Deal = sequelize.define('deals', {
    commissionPercentage: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    commissionPerUnit: {
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
    rentPercentage: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    rentFixed: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    rentTotal: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  })
  return Deal
}
