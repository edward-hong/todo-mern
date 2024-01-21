import { FC } from 'react'
import { Navigate } from 'react-router-dom'

import { isAuth } from '../utils/helpers'

interface PublicRouteProps {
  page: FC
}

const PublicRoute = ({ page: Page }: PublicRouteProps) =>
  isAuth() ? <Navigate to="/signin" /> : <Page />

export default PublicRoute
