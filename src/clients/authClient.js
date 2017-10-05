import url from 'url'
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest'

export default (type, params) => {
  if (type === AUTH_LOGIN) {
    const { email, password, token } = params

    if (email && password) { // Standard login
      const request = new Request(url.resolve(process.env.REACT_APP_API_URL, '/auth'), {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then(({ data: { token } }) => {
        localStorage.setItem('token', token)
      })
    } else if (email) { // Passwordless request
      const request = new Request(url.resolve(process.env.REACT_APP_API_URL, '/signin'), {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText)
        }
        return Promise.reject('Email sent!')
      })
    } else if (token) { // Passwordless confirm
      const request = new Request(url.resolve(process.env.REACT_APP_API_URL, '/auth/token'), {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then(({ data: { token } }) => {
        localStorage.setItem('token', token)
      })
    }
  }
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem('token')
    return Promise.resolve()
  }
  if (type === AUTH_ERROR) {
    const { status } = params
    if (status === 401 || status === 403) {
      localStorage.removeItem('token')
    }
    return Promise.reject(new Error(params))
  }
  if (type === AUTH_CHECK) {
    return localStorage.getItem('token') ? Promise.resolve() : Promise.reject(new Error('No token found'))
  }
  return Promise.reject(new Error(`Unsupported auth action type: ${type}`))
}
