const dbConfig = require('../config/dbConfig.js')
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
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
db.items = require('./Item.js')(sequelize, DataTypes)
db.units = require('./Unit.js')(sequelize, DataTypes)
db.amenities = require('./Amenity.js')(sequelize, DataTypes)
db.itemAmenities = require('./ItemAmenity.js')(sequelize, DataTypes)
db.dealDocuments = require('./DealDocument.js')(sequelize, DataTypes)
db.users.hasOne(db.verificationTokens)
db.verificationTokens.belongsTo(db.users)
db.users.hasMany(db.deals)
db.deals.belongsTo(db.users)
db.deals.hasMany(db.installments)
db.installments.belongsTo(db.deals)
db.deals.hasMany(db.dealDocuments)
db.dealDocuments.belongsTo(db.deals)
db.users.hasOne(db.nominees)
db.nominees.belongsTo(db.users)
db.users.hasMany(db.addresses)
db.addresses.belongsTo(db.users)
db.units.hasMany(db.items)
db.items.belongsTo(db.units)
db.items.hasOne(db.deals)
db.deals.belongsTo(db.items)
db.items.belongsToMany(db.amenities, { through: db.itemAmenities })
db.amenities.belongsToMany(db.items, { through: db.itemAmenities })
db.items.hasMany(db.itemAmenities)
db.itemAmenities.belongsTo(db.items)
db.amenities.hasMany(db.itemAmenities)
db.itemAmenities.belongsTo(db.amenities)

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
