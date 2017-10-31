import React from 'react'
import { shallow } from 'enzyme'
import { Admin } from 'admin-on-rest'

import App from './App'
import LoginPage from './containers/Login'
import authClient from './clients/authClient'
import restClient from './clients/restClient'

describe('App', () => {
  const app = shallow(<App/>)

  it('renders properly', () => {
    expect(app).toMatchSnapshot()
  })

  it('has Admin as the root component', () => {
    expect(app.type()).toBe(Admin)
  })

  describe('Admin', () => {
    it('uses the correct `authClient`', () => {
      expect(app.props().authClient).toBe(authClient)
    })

    it('uses the correct`restClient`', () => {
      expect(app.props().restClient).toBe(restClient)
    })

    it('uses the custom Login page container', () => {
      expect(app.props().loginPage).toBe(LoginPage)
    })
  })

  describe('when rendering resources', () => {
    it('renders the correct amount of resources', () => {
      expect(app.find('Resource').length).toBe(1)
    })

    it('renders the `users` resource', () => {
      const usersResource = app.findWhere(res => res.props().name === 'user')
      expect(usersResource.length).toBe(1)
    })
  })
})
