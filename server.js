require('dotenv').config()
const express = require('express')
const path = require('path')
const { logger, logEvents } = require('./middlewares/logger')
const errorHandler = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const db = require('./models')
const app = express()
const PORT = process.env.PORT || 3000

console.log(process.env.NODE_ENV)

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/deals', require('./routes/dealRoutes'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)
 // only for development
// {force: true}
 // only for development
db.sequelize
  .sync({ force: true })
  .then(async () => {
    console.log('Synced db.')
    await db.superAdmin()
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message)
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      'sequelizeErrLog.log'
    )
  })

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
