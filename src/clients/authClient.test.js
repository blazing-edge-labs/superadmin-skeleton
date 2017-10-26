import url from 'url'
import fetchMock from 'fetch-mock'
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK } from 'admin-on-rest'

import authClient from './authClient'
import { USER_ROLE_SUPERADMIN, API_ERROR_CODES, API_ROUTES } from '../constants'

const routes = API_ROUTES.auth

// fetch-mock fix for single-parameter fetch requests
// fetchMock.setImplementations({ Request: Request }) -- this fix works but it makes lastOptions() return undefined
const _fetchMock = fetchMock.fetchMock
fetchMock.fetchMock = (url, options) => {
  if (url instanceof Request && options === undefined) {
    return _fetchMock(url.url, url)
  }
  return _fetchMock(url, options)
}

const getLastCallParams = () => {
  return JSON.parse(fetchMock.lastOptions()._bodyText)
}

// route builder
const getRoute = (endpoint) => url.resolve(process.env.REACT_APP_API_URL, endpoint)

// mock credentials
const MOCK_EMAIL = 'test@example.com'
const MOCK_PASSWORD = 'testpassword'
const MOCK_USER_TOKEN = '000000000000000000000000'
const MOCK_EMAIL_TOKEN = '111111111111111111111111'

// mock responses
const mockResponseSuccess = { body: { data: { token: MOCK_USER_TOKEN } } }
const mockResponseInternalError = { status: 500, body: {} }
const mockResponseCustomError = { status: 403, body: { code: 2003, error: 'user.not.found' } }
const mockResponseCustomUnknownError = { status: 403, body: { code: 2007, error: 'code.not.found' } }

describe('authClient', async () => {
  describe('AUTH_LOGIN', async () => {
    describe('when receiving `email` & `password` as parameters', async () => {
      beforeAll(() => {
        fetchMock.postOnce(getRoute(routes.password_login), mockResponseSuccess)
      })

      it('resolves successfully', async () => {
        await expect(authClient(AUTH_LOGIN, { email: MOCK_EMAIL, password: MOCK_PASSWORD }))
        .resolves.toBeUndefined()
      })

      it('sends a `minRole` requirement, along with credentials to the API', () => {
        const params = getLastCallParams()
        expect(params.minRole).toEqual(USER_ROLE_SUPERADMIN)
        expect(params.email).toEqual(MOCK_EMAIL)
        expect(params.password).toEqual(MOCK_PASSWORD)
      })

      it('sets the received `token` in localStorage', () => {
        expect(localStorage.getItem('token')).toEqual(MOCK_USER_TOKEN)
      })
    })

    describe('when receiving `email` as the only parameter', async () => {
      beforeAll(() => {
        fetchMock.postOnce(getRoute(routes.passwordless_request), mockResponseSuccess)
      })

      it('rejects the promise (to prevent redirection), with the message "Email sent!"', async () => {
        await expect(authClient(AUTH_LOGIN, { email: MOCK_EMAIL })).rejects.toBe('Email sent!')
      })

      it('sends a `minRole` requirement, along with email to the API', () => {
        const params = getLastCallParams()
        expect(params.minRole).toEqual(USER_ROLE_SUPERADMIN)
        expect(params.email).toEqual(MOCK_EMAIL)
        expect(params.password).toBeUndefined()
      })
    })

    describe('when receiving `token` as the only parameter', async () => {
      beforeAll(() => {
        fetchMock.postOnce(getRoute(routes.passwordless_confirm), mockResponseSuccess)
        localStorage.clear()
      })

      it('resolves successfully', async () => {
        expect(localStorage.getItem('token')).toBeNull()
        await expect(authClient(AUTH_LOGIN, { token: MOCK_EMAIL_TOKEN })).resolves.toBeUndefined()
      })

      it('sends email `token` as the only parameter', () => {
        const params = getLastCallParams()
        expect(params.token).toEqual(MOCK_EMAIL_TOKEN)
        expect(Object.keys(params).length).toEqual(1)
      })

      it('sets the received `token` in localStorage', () => {
        expect(localStorage.getItem('token')).toEqual(MOCK_USER_TOKEN)
      })
    })

    describe('when the request is rejected with a generic error', async () => {
      beforeAll(() => {
        fetchMock.postOnce(getRoute(routes.passwordless_request), mockResponseInternalError)
      })

      it('throws an error with generic message ', async () => {
        await expect(authClient(AUTH_LOGIN, { email: MOCK_EMAIL })).rejects.toHaveProperty('message')
      })
    })

    describe('when the request is rejected with custom error', async () => {
      beforeAll(() => {
        fetchMock.postOnce(getRoute(routes.passwordless_request), mockResponseCustomError)
        fetchMock.postOnce(getRoute(routes.passwordless_request), mockResponseCustomUnknownError)
      })

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

  describe('AUTH_LOGOUT', () => {
    beforeAll(() => {
      localStorage.setItem('token', MOCK_USER_TOKEN)
    })

    it('resolves successfully', () => {
      return expect(authClient(AUTH_LOGOUT)).resolves.toBeUndefined()
    })

    it('removes  the `token` from localStorage', () => {
      expect(localStorage.getItem('token')).toBeNull()
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
