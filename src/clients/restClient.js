import url from 'url'
import { GET_LIST, GET_ONE, GET_MANY, UPDATE, CREATE, DELETE, fetchUtils } from 'admin-on-rest'

const API_URL = url.resolve(process.env.REACT_APP_API_URL, '/admin')

const convertRESTRequestToHTTP = (type, resource, params) => {
  let url = ''
  const {queryParameters} = fetchUtils

  const token = localStorage.getItem('token')
  const options = {
    headers: new Headers({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    }),
  }

  switch (type) {
    case GET_LIST:
      const {page, perPage} = params.pagination
      let {field, order} = params.sort
      if (field && (field === 'createdAt')) field = 'created_at'
      const query = {
        sort: JSON.stringify([field, order]),
        page,
        perPage,
        filter: JSON.stringify(params.filter),
      }
      url = `${API_URL}/${resource}?${queryParameters(query)}`
      break
    case GET_ONE:
      url = `${API_URL}/${resource}/${params.id}`
      break
    case GET_MANY:
      url = `${API_URL}/${resource}/many?${queryParameters({ids: JSON.stringify(params.ids)})}`
      break
    case UPDATE:
      url = `${API_URL}/${resource}/${params.id}`
      options.method = 'PUT'
      options.body = JSON.stringify(params.data)
      break
    case CREATE:
      url = `${API_URL}/${resource}`
      options.method = 'POST'
      options.body = JSON.stringify(params.data)
      break
    case DELETE:
      url = `${API_URL}/${resource}/${params.id}`
      options.method = 'DELETE'
      break
    default:
      throw new Error(`Unsupported fetch action type: ${type}`)
  }
  return {url, options}
}

const convertHTTPResponseToREST = (response, type, resource, params) => {
  const {json: {data}} = response
  switch (type) {
    case GET_LIST:
      return {
        data: data.items,
        total: parseInt(data.count, 10),
      }
    default:
      return {data}
  }
}

export default (type, resource, params) => {
  const {fetchJson} = fetchUtils
  const {url, options} = convertRESTRequestToHTTP(type, resource, params)
  return fetchJson(url, options)
  .then(response => convertHTTPResponseToREST(response, type, resource, params))
}
