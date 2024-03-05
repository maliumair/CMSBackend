module.exports = {
  HOST: process.env.MYSQLHOST,
  PORT: 3306,
  USER: process.env.MYSQLUSER,
  PASSWORD: process.env.MYSQLPASSWORD,
  DB: process.env.MYSQLDATABASE,
  MYSQL_URL: `mysql://root:@localhost:3306/cms_dev`,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
