import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import axios from 'axios'

import Toast from '../Toast'
import useToast from '../hooks/useToast'
import { isAuth } from '../utils/helpers'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [
    open,
    setOpen,
    severity,
    setSeverity,
    toastMsg,
    setToastMsg,
    handleClose,
  ] = useToast()

  const handleSubmit = e => {
    e.preventDefault()

    axios({
      method: 'POST',
      url: '/auth/signup',
      data: { name, email, password },
    })
      .then(response => {
        setName('')
        setEmail('')
        setPassword('')
        setSeverity('success')
        setToastMsg(response.data.message)
        setOpen(true)
      })
      .catch(error => {
        setSeverity('error')
        setToastMsg(error.response.data.error)
        setOpen(true)
      })
  }

  return (
    <Container maxWidth="sm">
      <Typography
        data-testid="heading"
        align="center"
        variant="h2"
        component="h1">
        Signup
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              inputProps={{ 'data-testid': 'name' }}
              label="Name"
              variant="outlined"
              size="small"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              inputProps={{ 'data-testid': 'email' }}
              label="Email"
              variant="outlined"
              size="small"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              inputProps={{ 'data-testid': 'password' }}
              label="Password"
              variant="outlined"
              size="small"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              data-testid="submit"
              type="submit"
              fullWidth
              variant="contained"
              color="primary">
              Signup
            </Button>
          </Grid>
        </Grid>
      </form>
      <Toast
        open={open}
        handleClose={handleClose}
        severity={severity}
        toastMsg={toastMsg}
      />
      {isAuth() ? <Navigate to="/" /> : null}
    </Container>
  )
}

export default Signup
