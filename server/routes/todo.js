const express = require('express')
const router = express.Router()

const {
  userTodos,
  addTodo,
  removeTodo,
  editTodo,
  completeTodo,
} = require('../controllers/todo')

router.get('/:userId', userTodos)
router.post('/add', addTodo)
router.delete('/remove/:todoId', removeTodo)
router.put('/edit', editTodo)
router.put('/complete', completeTodo)

module.exports = router
