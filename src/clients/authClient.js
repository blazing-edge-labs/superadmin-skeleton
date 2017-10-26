import url from 'url'
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest'

import { USER_ROLE_SUPERADMIN, API_ERROR_CODES, API_ROUTES } from '../constants'

const routes = API_ROUTES.auth

const validateResponse = async (response) => {
  const resBody = await response.json()
  if (response.status < 200 || response.status >= 300) {
    let message = ''
    if (resBody && resBody.error && resBody.code) {
      message = API_ERROR_CODES[resBody.code] || resBody.error
    } else {
      message = response.statusText
    }
    throw new Error(message)
  }
  return resBody
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

    if (email && password) { // Password login
      const request = newAuthRequest(routes.password_login, { email, password, minRole: USER_ROLE_SUPERADMIN })
      return fetch(request)
      .then(validateResponse)
      .then(({ data: { token } }) => setTokenInLocalStorage(token))
    } else if (email) { // Passwordless request
      const request = newAuthRequest(routes.passwordless_request, { email, minRole: USER_ROLE_SUPERADMIN })
      return fetch(request)
      .then(validateResponse)
      .then(() => Promise.reject('Email sent!')) // eslint-disable-line prefer-promise-reject-errors
    } else if (token) { // Passwordless confirm
      const request = newAuthRequest(routes.passwordless_confirm, { token })
      return fetch(request)
      .then(validateResponse)
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
