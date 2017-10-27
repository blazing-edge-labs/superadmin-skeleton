import _url from 'url'
import queryString from 'query-string'
import { GET_LIST, GET_ONE, GET_MANY, UPDATE, CREATE, DELETE } from 'admin-on-rest'

import restClient, { convertRESTRequestToHTTP, convertHTTPResponseToREST } from './restClient'
import { API_ROUTES } from '../constants'

// --------------------------
const parseUrl = (url) => _url.parse(url)
const parseQuery = (query) => {
  const parsedQuery = queryString.parse(query)
  Object.entries(parsedQuery).forEach(([key, value]) => {
    parsedQuery[key] = JSON.parse(value)
  })
  return parsedQuery
}

const resource = 'user'
const MOCK_USER_TOKEN = '000000000000000000000000'

const expectedPath = `${API_ROUTES.rest.superadmin}/${resource}`

const getRestToHttpData = (type, params) => {
  const { url: urlString, options } = convertRESTRequestToHTTP(type, resource, params)
  const url = parseUrl(urlString)
  const query = parseQuery(url.query)
  const { headers, method } = options
  return { url, query, headers, method }
}

describe('convertRESTRequestToHTTP', () => {
  let url, query, headers, method

  beforeAll(() => {
    localStorage.setItem('token', MOCK_USER_TOKEN)
  })

  describe('when action type is `GET_LIST`', () => {
    const params = { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' }, filter: {} }

    beforeAll(() => {
      ({ url, query, headers, method } = getRestToHttpData(GET_LIST, params))
    })

    it('sets the correct path name', () => {
      expect(url.pathname).toEqual(expectedPath)
    })

    it('correctly sets the `authorization` header from localStorage', () => {
      const token = headers.get('authorization').split(' ')[1]
      expect(token).toEqual(MOCK_USER_TOKEN)
    })

    it('correctly formats the query parameters', () => {
      expect(query.filter).toEqual({})
      expect(query.page).toEqual(1)
      expect(query.perPage).toEqual(10)
      expect(query.sort[0]).toEqual('id')
      expect(query.sort[1]).toEqual('ASC')
    })

    it('sets the `method` to `GET`', () => {
      expect(method).toEqual('GET')
    })
  })

  describe('when action type is `GET_ONE`', () => {
    const params = { id: 1 }

    beforeAll(() => {
      ({ url, query, headers, method } = getRestToHttpData(GET_ONE, params))
    })

    it('sets the correct path name, including the resource ID', () => {
      expect(url.pathname).toEqual(`${expectedPath}/${params.id}`)
    })

    it('correctly sets the `authorization` header from localStorage', () => {
      const token = headers.get('authorization').split(' ')[1]
      expect(token).toEqual(MOCK_USER_TOKEN)
    })

    it('creates no query parameters', () => {
      expect(query).toEqual({})
    })

    it('sets the `method` to `GET`', () => {
      expect(method).toEqual('GET')
    })
  })
})

describe('convertHTTPResponseToREST', () => {
})

describe('restClient', async () => {
})
