module.exports = (sequelize, DataTypes) => {
  const VerificationToken = sequelize.define('verificationTokens', {
    token: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
  })
  return VerificationToken
}
