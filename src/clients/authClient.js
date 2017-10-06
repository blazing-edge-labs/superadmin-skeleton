import url from 'url'
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest'

import { USER_ROLE_SUPERADMIN, API_ERROR_CODES } from '../constants'

const getResponseJSON = (response) => {
  return response.json()
}

const validateResponseStatus = (response) => {
  if (response.error) {
    const message = API_ERROR_CODES[response.code] || response.error
    throw new Error(message)
  }
  return response
}

const setTokenInLocalStorage = (token) => {
  localStorage.setItem('token', token)
}

const newAuthRequest = (apiEndpoint, credentials) => (
  new Request(url.resolve(process.env.REACT_APP_API_URL, apiEndpoint),
  {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  })
)

export default (type, params) => {
  if (type === AUTH_LOGIN) {
    const { email, password, token } = params

    if (email && password) { // Standard login
      const request = newAuthRequest('/auth', { email, password })
      return fetch(request)
      .then(getResponseJSON)
      .then(validateResponseStatus)
      .then(({ data: { token } }) => setTokenInLocalStorage(token))
    } else if (email) { // Passwordless request
      const request = newAuthRequest('/signin', { email, minRole: USER_ROLE_SUPERADMIN })
      return fetch(request)
      .then(getResponseJSON)
      .then(validateResponseStatus)
      .then(() => Promise.reject('Email sent!'))
    } else if (token) { // Passwordless confirm
      const request = newAuthRequest('/auth/token', { token })
      return fetch(request)
      .then(getResponseJSON)
      .then(validateResponseStatus)
      .then(({ data: { token } }) => setTokenInLocalStorage(token))
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
