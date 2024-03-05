module.exports = {
  HOST: process.env.MYSQLHOST,
  PORT: process.env.MYSQLPORT,
  USER: process.env.MYSQLUSER,
  PASSWORD: process.env.MYSQLPASSWORD,
  DB: process.env.MYSQLDATABASE,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
