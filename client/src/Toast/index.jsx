import PropTypes from 'prop-types'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const Toast = ({ open, handleClose, severity, toastMsg }) => (
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

Toast.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  severity: PropTypes.string.isRequired,
  toastMsg: PropTypes.string.isRequired,
}

export default Toast
