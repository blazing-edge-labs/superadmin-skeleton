import React from 'react'
import { shallow } from 'enzyme'

import UserCreate from './'

describe('UserCreate', () => {
  const userCreate = shallow(<UserCreate/>)

  it('renders properly', () => {
    expect(userCreate).toMatchSnapshot()
  })
})
