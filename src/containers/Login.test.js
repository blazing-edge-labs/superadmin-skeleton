import React from 'react'
import { shallow } from 'enzyme'

import Login from './Login'

// TODO: find out how to render(test) this (redux)(redux-form)connected component

describe('Login', () => {
  const login = shallow(<Login/>)

  it('renders properly', () => {
    expect(login).toMatchSnapshot()
  })
})
