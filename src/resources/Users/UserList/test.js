import React from 'react'
import { shallow } from 'enzyme'

import UserList from './'

describe('UserList', () => {
  const userList = shallow(<UserList/>)

  it('renders properly', () => {
    expect(userList).toMatchSnapshot()
  })
})
