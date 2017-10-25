import url from 'url'
import fetchMock from 'fetch-mock'
import { AUTH_CHECK } from 'admin-on-rest'

import authClient from './authClient'

const getRoute = (endpoint) => url.resolve(process.env.REACT_APP_API_URL, endpoint)
const mockResponseSuccess = {
  status: 200,
  body: {
    data: {
      token: '000000000000000000000000',
    },
  },
}

describe('authClient', async () => {
  fetchMock.post(getRoute('/auth'), mockResponseSuccess)

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
