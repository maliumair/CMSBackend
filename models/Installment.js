module.exports = (sequelize, DataTypes) => {
  const Installment = sequelize.define('installments', {
    installmentType: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    installmentAmount: {
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
      allowNull: false,
      required: true,
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
