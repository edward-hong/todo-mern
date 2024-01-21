import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import { ToastSeverity } from '../types/ToastSeverity'

interface ToastProps {
  open: boolean
  handleClose: () => void
  severity: ToastSeverity
  toastMsg: string
}

const Toast = ({ open, handleClose, severity, toastMsg }: ToastProps) => (
  <Snackbar
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    open={open}
    autoHideDuration={6000}
    onClose={handleClose}>
    <Alert
      data-testid="toast"
      elevation={6}
      variant="filled"
      onClose={handleClose}
      severity={severity}>
      {toastMsg}
    </Alert>
  </Snackbar>
)

export default Toast
