import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { isAuth, signout } from '../utils/helpers'

const styles = {
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
  },
}

const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(isAuth())

  const userInfo = localStorage.getItem('user')

  useEffect(() => {
    userInfo ? setIsLoggedIn(true) : setIsLoggedIn(false)
  }, [pathname, userInfo])

  const handleSignout = () => {
    signout(() => {
      setIsLoggedIn(false)
      navigate('/signin')
    })
  }

  return (
    <div style={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={styles.title}>
            <Link style={styles.navLink} to="/">
              Todo
            </Link>
          </Typography>

          {isLoggedIn ? (
            <Button color="inherit" onClick={handleSignout}>
              Signout
            </Button>
          ) : (
            <>
              <Button color="inherit">
                <Link style={styles.navLink} to="/signup">
                  Signup
                </Link>
              </Button>
              <Button color="inherit">
                <Link style={styles.navLink} to="/signin">
                  Signin
                </Link>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navbar
