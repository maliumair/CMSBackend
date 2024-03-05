const dbConfig = require('../config/dbConfig.js')
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize
db.users = require('./User.js')(sequelize, DataTypes)
db.deals = require('./Deal.js')(sequelize, DataTypes)
db.installments = require('./Installment.js')(sequelize, DataTypes)
db.nominees = require('./Nominee.js')(sequelize, DataTypes)
db.addresses = require('./Address.js')(sequelize, DataTypes)
db.verificationTokens = require('./VerificationToken.js')(sequelize, DataTypes)
db.users.hasOne(db.verificationTokens)
db.verificationTokens.belongsTo(db.users)
db.users.hasMany(db.deals)
db.deals.belongsTo(db.users)
db.deals.hasMany(db.installments)
db.installments.belongsTo(db.deals)
db.users.hasOne(db.nominees)
db.nominees.belongsTo(db.users)
db.users.hasMany(db.addresses)
db.addresses.belongsTo(db.users)

db.superAdmin = async () => {
  const superAdmin = await db.users.findOne({ where: { role: 'superadmin' } })
  if (!superAdmin) {
    const newSuper = await db.users.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: process.env.MAIL_USER,
      role: 'superadmin',
    })
  }
}

module.exports = db
