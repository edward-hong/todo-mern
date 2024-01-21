import { useState } from 'react'

import { ToastSeverity } from '../types/ToastSeverity'

const useToast = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [severity, setSeverity] = useState<ToastSeverity>('success')
  const [toastMsg, setToastMsg] = useState<string>('')

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
  ] as const
}

export default useToast
