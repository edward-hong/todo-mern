const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    trim: true,
    required: true,
  },
  completed: { type: Boolean, default: false },
  userId: String,
})

module.exports = mongoose.model('Todo', todoSchema)
