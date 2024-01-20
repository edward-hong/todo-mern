import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

import { isAuth } from '../utils/helpers'

const PrivateRoute = ({ page: Page, ...rest }) =>
  isAuth() ? (
    <Page />
  ) : (
    <Navigate to={{ pathname: '/signin', state: { from: rest.location } }} />
  )

PrivateRoute.propTypes = {
  page: PropTypes.func,
}

export default PrivateRoute
