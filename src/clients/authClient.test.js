import url from 'url'
import fetchMock from 'fetch-mock'
import { AUTH_LOGIN, AUTH_CHECK } from 'admin-on-rest'

import authClient from './authClient'
import { USER_ROLE_SUPERADMIN, API_ERROR_CODES } from '../constants'

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

// mock credentials
const MOCK_EMAIL = 'test@example.com'
const MOCK_PASSWORD = 'testpassword'
const MOCK_USER_TOKEN = '000000000000000000000000'

// mock responses
const mockResponseSuccess = { body: { data: { token: MOCK_USER_TOKEN } } }
const mockResponseInternalError = { status: 500, body: {} }
const mockResponseCustomError = { status: 403, body: { code: 2003, error: 'user.not.found' } }
const mockResponseCustomUnknownError = { status: 403, body: { code: 2007, error: 'code.not.found' } }

describe('authClient', async () => {
  describe('AUTH_LOGIN', async () => {
    describe('when receiving email & password as parameters', async () => {
      fetchMock.postOnce(getRoute('/auth'), mockResponseSuccess)

      it('sets the `token` in localStorage on successful login', async () => {
        await authClient(AUTH_LOGIN, { email: MOCK_EMAIL, password: MOCK_PASSWORD })
        expect(localStorage.getItem('token')).toEqual(MOCK_USER_TOKEN)
      })

      it('sends a `minRole` requirement, along with credentials to the API', () => {
        const opts = JSON.parse(fetchMock.lastOptions()._bodyInit)
        expect(opts.minRole).toEqual(USER_ROLE_SUPERADMIN)
        expect(opts.email).toEqual(MOCK_EMAIL)
        expect(opts.password).toEqual(MOCK_PASSWORD)
      })
    })

    describe('when the request is rejected with a generic error', async () => {
      fetchMock.postOnce(getRoute('/signin'), mockResponseInternalError)
      it('throws an error with generic message ', async () => {
        await expect(authClient(AUTH_LOGIN, { email: MOCK_EMAIL })).rejects.toHaveProperty('message')
      })
    })

    describe('when the request is rejected with custom error', async () => {
      fetchMock.postOnce(getRoute('/signin'), mockResponseCustomError)
      fetchMock.postOnce(getRoute('/signin'), mockResponseCustomUnknownError)

      it('throws with a message based on error `code`', async () => {
        await expect(authClient(AUTH_LOGIN, { email: MOCK_EMAIL }))
        .rejects.toHaveProperty('message', API_ERROR_CODES[mockResponseCustomError.body.code])
      })

      it('throws with a message from the body if error `code` is unknown', async () => {
        await expect(authClient(AUTH_LOGIN, { email: MOCK_EMAIL }))
        .rejects.toHaveProperty('message', mockResponseCustomUnknownError.body.error)
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
        localStorage.setItem('token', MOCK_USER_TOKEN)
      })

      it('Successfully resolves', async () => {
        await expect(authClient(AUTH_CHECK)).resolves.toBe(undefined)
      })
    })
  })
})
