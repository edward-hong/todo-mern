import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import axios from 'axios'

import Toast from '../Toast'
import useToast from '../hooks/useToast'
import { authenticate, isAuth } from '../utils/helpers.js'

const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
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
      url: '/auth/signin',
      data: { email, password },
    })
      .then(response => {
        authenticate(response)
        navigate('/')
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
        data-testid="heaRedirectding"
        align="center"
        variant="h2"
        component="h1">
        Signin
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
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
              Signin
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography data-testid="forgot" align="right" component="p">
              Forgot Password? Click <Link to="/forgot">here</Link>
            </Typography>
          </Grid>
        </Grid>
      </form>
      <Toast
        open={open}
        handleClose={handleClose}
        severity={severity}
        toastMsg={toastMsg}
      />
      {isAuth() && <Navigate to="/" />}
    </Container>
  )
}

export default Signin
