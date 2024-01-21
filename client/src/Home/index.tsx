import { useState, useEffect, KeyboardEventHandler } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import ClearIcon from '@mui/icons-material/Clear'
import axios from 'axios'

import Toast from '../Toast'
import useToast from '../hooks/useToast'

interface Todo {
  _id: string
  todo: string
  completed: boolean
  isEdit: boolean
  userId: string
}

interface NewTodo {
  todo: string
  isEdit: boolean
  completed?: boolean
  userId?: string
}

const Home = () => {
  const userId = JSON.parse(localStorage.getItem('user') as string)._id

  const [newTodo, setNewTodo] = useState<NewTodo>({
    todo: '',
    isEdit: false,
    completed: false,
    userId,
  })
  const [todos, setTodos] = useState<Todo[]>([])
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([])
  const [tempEditTodo, setTempEditTodo] = useState('')
  const [
    open,
    setOpen,
    severity,
    setSeverity,
    toastMsg,
    setToastMsg,
    handleClose,
  ] = useToast()

  useEffect(() => {
    axios
      .get(`/todo/${userId}`)
      .then(({ data }) => {
        setTodos(
          data.todos
            .map((todo: Todo) => {
              todo.isEdit = false
              return todo
            })
            .filter((todo: Todo) => {
              return !todo.completed
            })
        )
        setCompletedTodos(
          data.todos
            .map((todo: Todo) => {
              todo.isEdit = false
              return todo
            })
            .filter((todo: Todo) => {
              return todo.completed
            })
        )
      })
      .catch(error => {
        console.error('SIGNIN ERROR', error.response.data)
      })
  }, [userId])

  const addTodo = () => {
    if (newTodo.todo) {
      axios({
        method: 'POST',
        url: '/todo/add',
        data: { userId, todo: newTodo.todo },
      })
        .then(({ data }) => {
          setSeverity('success')
          setToastMsg(data.message)
          setOpen(true)
          setNewTodo({
            todo: '',
            isEdit: false,
            completed: false,
            userId,
          })
          setTodos([...todos, data.todo])
        })
        .catch(error => {
          console.error('ADD TODO ERROR', error.response.data)
          setSeverity('error')
          setToastMsg(error.response.data.error)
          setOpen(true)
        })
    }
  }

  const handleComplete = (i: number, id: string) => () => {
    axios({
      method: 'PUT',
      url: '/todo/complete',
      data: { todoId: id },
    })
      .then(({ data }) => {
        setSeverity('success')
        setToastMsg(data.message)
        setOpen(true)
        setTodos([...todos.slice(0, i), ...todos.slice(i + 1)])
        setCompletedTodos([...completedTodos, data.completedTodo])
      })
      .catch(error => {
        console.error('COMPLETE TODO ERROR', error.response.data)
        setSeverity('error')
        setToastMsg(error.response.data.error)
        setOpen(true)
      })
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const handleEditMode = (i: number) => () => {
    todos[i].isEdit ? setTempEditTodo('') : setTempEditTodo(todos[i].todo)
    setTodos([
      ...todos.slice(0, i),
      { ...todos[i], isEdit: !todos[i].isEdit },
      ...todos.slice(i + 1),
    ])
  }

  const handleEdit = (i: number, id: string | undefined) => () => {
    axios({
      method: 'PUT',
      url: '/todo/edit',
      data: { todoId: id, editedTodo: tempEditTodo },
    })
      .then(({ data }) => {
        setSeverity('success')
        setToastMsg(data.message)
        setOpen(true)
        setTodos([
          ...todos.slice(0, i),
          { ...todos[i], todo: tempEditTodo, isEdit: !todos[i].isEdit },
          ...todos.slice(i + 1),
        ])
      })
      .catch(error => {
        console.error('EDIT TODO ERROR', error.response.data)
        setSeverity('error')
        setToastMsg(error.response.data.error)
        setOpen(true)
      })
  }

  const handleDelete = (i: number, id: string) => () => {
    axios({
      method: 'DELETE',
      url: `/todo/remove/${id}`,
    })
      .then(({ data }) => {
        setSeverity('success')
        setToastMsg(data.message)
        setOpen(true)
        data.deletedTodo.completed
          ? setCompletedTodos([
              ...completedTodos.slice(0, i),
              ...completedTodos.slice(i + 1),
            ])
          : setTodos([...todos.slice(0, i), ...todos.slice(i + 1)])
      })
      .catch(error => {
        console.error('REMOVE TODO ERROR', error.response.data)
        setSeverity('error')
        setToastMsg(error.response.data.error)
        setOpen(true)
      })
  }

  const isDisabled = () => {
    for (const todo of todos) {
      if (todo.isEdit) {
        return true
      }
    }
    return false
  }

  return (
    <Container maxWidth="sm">
      <Typography align="center" variant="h2" component="h1">
        Todo List
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={11}>
          <TextField
            onChange={e => setNewTodo({ todo: e.target.value, isEdit: false })}
            onKeyDown={handleKeyDown}
            value={newTodo.todo}
            fullWidth
            label="Add Todo"
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={1}>
          <Button disabled={isDisabled()} onClick={addTodo} variant="contained">
            <AddIcon />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <List>
            {todos.map(({ todo, isEdit, _id }, i) => (
              <ListItem divider key={_id}>
                {isEdit ? (
                  <>
                    <TextField
                      fullWidth
                      label="Edit Todo"
                      variant="outlined"
                      size="small"
                      value={tempEditTodo}
                      onChange={e => setTempEditTodo(e.target.value)}
                    />
                    <ButtonGroup
                      variant="contained"
                      aria-label="contained primary button group"
                      sx={{
                        '.MuiButtonGroup-grouped:not(:last-of-type)': {
                          borderColor: '#FFFFFF',
                        },
                      }}
                      style={{ marginLeft: 8 }}>
                      <Button onClick={handleEdit(i, _id)} color="warning">
                        <CreateIcon />
                      </Button>
                      <Button onClick={handleEditMode(i)} color="error">
                        <ClearIcon />
                      </Button>
                    </ButtonGroup>
                  </>
                ) : (
                  <>
                    <ListItemText primary={todo} />
                    <ButtonGroup
                      variant="contained"
                      aria-label="contained primary button group"
                      sx={{
                        '.MuiButtonGroup-grouped:not(:last-of-type)': {
                          borderColor: '#FFFFFF',
                        },
                      }}>
                      <Button
                        onClick={handleComplete(i, _id)}
                        disabled={isDisabled()}
                        color="success">
                        <CheckIcon />
                      </Button>
                      <Button
                        disabled={isDisabled()}
                        onClick={handleEditMode(i)}
                        color="warning"
                        sx={{ borderColor: 'black' }}>
                        <CreateIcon />
                      </Button>
                      <Button
                        disabled={isDisabled()}
                        onClick={handleDelete(i, _id)}
                        color="error">
                        <DeleteIcon />
                      </Button>
                    </ButtonGroup>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" variant="h4" component="h2">
            Completed
          </Typography>
          <List>
            {completedTodos.map(({ todo, _id }, i) => {
              return (
                <ListItem divider key={_id}>
                  <ListItemText
                    primary={todo}
                    style={{ textDecoration: 'line-through' }}
                  />
                  <Button
                    disabled={isDisabled()}
                    onClick={handleDelete(i, _id)}>
                    <DeleteIcon color="error" />
                  </Button>
                </ListItem>
              )
            })}
          </List>
        </Grid>
      </Grid>
      <Toast
        open={open}
        handleClose={handleClose}
        severity={severity}
        toastMsg={toastMsg}
      />
    </Container>
  )
}

export default Home
