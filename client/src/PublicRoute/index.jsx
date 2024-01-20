import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

import { isAuth } from '../utils/helpers'

const PublicRoute = ({ page: Page, ...rest }) =>
  isAuth() ? (
    <Navigate to={{ pathname: '/signin', state: { from: rest.location } }} />
  ) : (
    <Page />
  )

PublicRoute.propTypes = {
  page: PropTypes.func,
}

export default PublicRoute
