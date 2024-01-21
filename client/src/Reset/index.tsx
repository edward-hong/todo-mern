import { useState, useEffect, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import axios from 'axios'

import Toast from '../Toast'
import useToast from '../hooks/useToast'

const Reset = () => {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [
    open,
    setOpen,
    severity,
    setSeverity,
    toastMsg,
    setToastMsg,
    handleClose,
  ] = useToast()

  const urlToken = useParams().token

  useEffect(() => {
    setToken(urlToken as string)
  }, [urlToken])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    axios({
      method: 'PUT',
      url: '/auth/reset-password',
      data: { newPassword, resetPasswordLink: token },
    })
      .then(response => {
        setNewPassword('')
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
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              inputProps={{ 'data-testid': 'password' }}
              label="New Password"
              variant="outlined"
              size="small"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              data-testid="submit"
              type="submit"
              fullWidth
              variant="contained"
              color="primary">
              Set New Password
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

export default Reset
