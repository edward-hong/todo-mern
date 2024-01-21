import { useState, FormEvent } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import axios from 'axios'

import Toast from '../Toast'
import useToast from '../hooks/useToast'

const Forgot = () => {
  const [email, setEmail] = useState('')
  const [
    open,
    setOpen,
    severity,
    setSeverity,
    toastMsg,
    setToastMsg,
    handleClose,
  ] = useToast()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    axios({
      method: 'PUT',
      url: '/auth/forgot-password',
      data: { email },
    })
      .then(response => {
        setEmail('')
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
        Forgot Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              inputProps={{ 'data-testid': 'email' }}
              variant="outlined"
              size="small"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              data-testid="submit"
              type="submit"
              fullWidth
              variant="contained"
              color="primary">
              Reset Password
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
    </Container>
  )
}

export default Forgot
