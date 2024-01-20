import { useState } from 'react'

const useToast = () => {
  const [open, setOpen] = useState(false)
  const [severity, setSeverity] = useState('success')
  const [toastMsg, setToastMsg] = useState('')

  const handleClose = () => {
    setOpen(false)
  }

  return [
    open,
    setOpen,
    severity,
    setSeverity,
    toastMsg,
    setToastMsg,
    handleClose,
  ]
}

export default useToast
