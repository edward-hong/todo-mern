import { FC } from 'react'
import { Navigate } from 'react-router-dom'

import { isAuth } from '../utils/helpers'

interface PrivateRouteProps {
  page: FC
}

const PrivateRoute = ({ page: Page }: PrivateRouteProps) =>
  isAuth() ? <Page /> : <Navigate to="/signin" />

export default PrivateRoute
