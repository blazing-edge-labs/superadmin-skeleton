import React from 'react'
import { shallow } from 'enzyme'

import UserEdit from './'

describe('UserEdit', () => {
  const userEdit = shallow(<UserEdit/>)

  it('renders properly', () => {
    expect(userEdit).toMatchSnapshot()
  })
})
