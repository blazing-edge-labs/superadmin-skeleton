import _url from 'url'
import queryString from 'query-string'
import { GET_LIST, GET_ONE, GET_MANY, UPDATE, CREATE, DELETE } from 'admin-on-rest'

import restClient, { convertRESTRequestToHTTP, convertHTTPResponseToREST } from './restClient'
// import { API_ROUTES } from '../constants'

// const API_URL = _url.resolve(process.env.REACT_APP_API_URL, API_ROUTES.rest.superadmin)

const MOCK_USER_TOKEN = '000000000000000000000000'

describe('convertRESTRequestToHTTP', () => {
  const resource = 'user'
  const params = {
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
  }

  beforeAll(() => {
    localStorage.setItem('token', MOCK_USER_TOKEN)
  })

  describe('when action type is `GET_LIST`', () => {
    let url, query, options

    beforeAll(() => {
      const type = GET_LIST
      const result = convertRESTRequestToHTTP(type, resource, params)
      url = _url.parse(result.url)
      query = queryString.parse(url.query)
      options = result.options
    })

    it('correctly sets the `authorization` header in options', () => {
      const token = options.headers.get('authorization').split(' ')[1]
      expect(token).toEqual(MOCK_USER_TOKEN)
    })

    it('correctly formats the query parameters', () => {
      expect(JSON.parse(query.filter)).toEqual({})
      expect(JSON.parse(query.page)).toEqual(1)
      expect(JSON.parse(query.perPage)).toEqual(10)
      expect(JSON.parse(query.sort)[0]).toEqual('id')
      expect(JSON.parse(query.sort)[1]).toEqual('ASC')
    })
  })
})

describe('convertHTTPResponseToREST', () => {
})

describe('restClient', async () => {
})
