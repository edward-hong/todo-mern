const Todo = require('../models/todo')

exports.userTodos = (req, res) => {
  const { userId } = req.params

  Todo.find({ userId })
    .then(todos => {
      res.json({ todos })
    })
    .catch(err => {
      res.json({
        message: err.message,
      })
    })
}

exports.addTodo = (req, res) => {
  const { userId, todo } = req.body

  const newTodo = new Todo({ userId, todo })
  newTodo
    .save()
    .then(savedTodo => {
      res
        .status(200)
        .json({ todo: savedTodo, message: 'Todo added successfully' })
    })
    .catch(_err => {
      res.status(400).send('Todo add failed')
    })
}

exports.removeTodo = (req, res) => {
  const { todoId } = req.params

  Todo.findByIdAndDelete(todoId)
    .then(deletedTodo => {
      res
        .status(200)
        .json({ deletedTodo, message: 'Todo removed successfully' })
    })
    .catch(_err => {
      res.status(400).send('Todo remove failed')
    })
}

exports.editTodo = (req, res) => {
  const { todoId, editedTodo } = req.body

  Todo.findByIdAndUpdate({ _id: todoId }, { todo: editedTodo }, { new: true })
    .then(updatedTodo => {
      res.status(200).json({ updatedTodo, message: 'Todo edited successfully' })
    })
    .catch(_err => {
      res.status(400).send('Todo edit failed')
    })
}

exports.completeTodo = (req, res) => {
  const { todoId } = req.body

  Todo.findByIdAndUpdate({ _id: todoId }, { completed: true }, { new: true })
    .then(completedTodo => {
      res
        .status(200)
        .json({ completedTodo, message: 'Todo completed successfully' })
    })
    .catch(_err => {
      res.status(400).send('Todo complete failed')
    })
}
