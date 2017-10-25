import url from 'url'
import fetchMock from 'fetch-mock'
import { AUTH_LOGIN, AUTH_CHECK } from 'admin-on-rest'

import authClient from './authClient'
import { USER_ROLE_SUPERADMIN } from '../constants'

// fetch-mock fix for single-parameter fetch requests
// fetchMock.setImplementations({ Request: Request }) -- this fix works but it makes lastOptions() return undefined
const _fetchMock = fetchMock.fetchMock
fetchMock.fetchMock = (url, options) => {
  if (url instanceof Request && options === undefined) {
    return _fetchMock(url.url, url)
  }
  return _fetchMock(url, options)
}

// route builder
const getRoute = (endpoint) => url.resolve(process.env.REACT_APP_API_URL, endpoint)

// mock responses
const mockResponseSuccess = {
  body: {
    data: {
      token: '000000000000000000000000',
    },
  },
}

describe('authClient', async () => {
  describe('AUTH_LOGIN', async () => {
    describe('when receiving email & password as parameters', async () => {
      fetchMock.postOnce(getRoute('/auth'), mockResponseSuccess)

      const email = 'test@example.com'
      const password = 'testpassword'

      it('sets the `token` in localStorage on successful login', async () => {
        await authClient(AUTH_LOGIN, { email, password })
        expect(localStorage.getItem('token')).toEqual(mockResponseSuccess.body.data.token)
      })

      it('sends a `minRole` requirement, along with credentials to the API', () => {
        const opts = JSON.parse(fetchMock.lastOptions()._bodyInit)
        expect(opts.minRole).toEqual(USER_ROLE_SUPERADMIN)
        expect(opts.email).toEqual(email)
        expect(opts.password).toEqual(password)
      })
    })
  })

  describe('AUTH_CHECK', async () => {
    describe('when token is not present', async () => {
      beforeEach(() => {
        localStorage.clear()
      })

      it('Rejects with an error', async () => {
        await expect(authClient(AUTH_CHECK)).rejects.toHaveProperty('message', 'No token found')
      })
    })

    describe('when token is present', async () => {
      beforeEach(() => {
        localStorage.setItem('token', mockResponseSuccess.body.data.token)
      })

      it('Successfully resolves', async () => {
        await expect(authClient(AUTH_CHECK)).resolves.toBe(undefined)
      })
    })
  })
})
