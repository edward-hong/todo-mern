import cookie from 'js-cookie'

// set in cookie
export const setCookie = (key: string, value: string) => {
  if (window !== undefined) {
    cookie.set(key, value, {
      expires: 1,
    })
  }
}

// remove from cookie
export const removeCookie = (key: string) => {
  if (window !== undefined) {
    cookie.remove(key, {
      expires: 1,
    })
  }
}

// get from cookie such as stored token
// will be useful when we need to make request to server with token
export const getCookie = (key: string) => {
  if (window !== undefined) {
    return cookie.get(key)
  }
}

// set in localstorage
export const setLocalStorage = (key: string, value: string) => {
  if (window !== undefined) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

// remove from localstorage
export const removeLocalStorage = (key: string) => {
  if (window !== undefined) {
    localStorage.removeItem(key)
  }
}

interface Res {
  data: {
    token: string
    user: string
  }
}

// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (res: Res) => {
  setCookie('token', res.data.token)
  setLocalStorage('user', res.data.user)
}

// access user info from localstorage
export const isAuth = () => {
  if (window !== undefined) {
    const cookieChecked = getCookie('token')
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return true
      } else {
        return false
      }
    }
  }
}

export const signout = (next: () => void) => {
  removeCookie('token')
  removeLocalStorage('user')
  next()
}
