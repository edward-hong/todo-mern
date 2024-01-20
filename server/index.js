require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const todoRoutes = require('./routes/todo')

const app = express()

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(`DB connection error: ${err.message}`))

app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev'))
  app.use(cors({ origin: process.env.CLIENT_URL }))
}

app.use('/auth', authRoutes)
app.use('/todo', todoRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`)
})
