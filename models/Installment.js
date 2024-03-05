module.exports = (sequelize, DataTypes) => {
  const Installment = sequelize.define('installments', {
    installmentType: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    installmentPercentage: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
    installmentFixed: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
    installmentAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
    installmentAmountPaid: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
    installmentDueOn: {
      type: DataTypes.DATE,
      allowNull: false,
      required: true,
    },
    installmentPaidOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      required: true,
    },
  })

  return Installment
}
