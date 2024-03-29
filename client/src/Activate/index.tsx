import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { decodeJwt } from 'jose'
import axios from 'axios'

import Toast from '../Toast'
import useToast from '../hooks/useToast'

const Activate = () => {
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [
    open,
    setOpen,
    severity,
    setSeverity,
    toastMsg,
    setToastMsg,
    handleClose,
  ] = useToast()

  const params = useParams()

  useEffect(() => {
    setToken(params.token as string)
    setName(decodeJwt(params.token as string).name as string)
  }, [params.token])

  const handleSubmit = () => {
    axios({
      method: 'POST',
      url: '/auth/activation',
      data: { token },
    })
      .then(response => {
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
        variant="h5"
        component="h1">
        Hey {name}, ready to activate your account?
      </Typography>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}>
        Activate
      </Button>
      <Toast
        open={open}
        handleClose={handleClose}
        severity={severity}
        toastMsg={toastMsg}
      />
    </Container>
  )
}

export default Activate
