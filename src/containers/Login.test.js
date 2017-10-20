import React from 'react'
import { shallow } from 'enzyme'

import { Login } from './Login'

const mockUserLogin = jest.fn()
const mockShowNotification = jest.fn()
const createMockSubmit = (data) => jest.fn(fn => () => fn(data))
const makeNewShallow = (inputValues) => {
  const props = {
    handleSubmit: createMockSubmit(inputValues),
    userLogin: mockUserLogin,
    showNotification: mockShowNotification,
  }
  return shallow(<Login {...props} />)
}

describe('Login', () => {
  let login = makeNewShallow({})

  describe('rendering', () => {
    it('renders properly', () => {
      expect(login.dive()).toMatchSnapshot()
    })

    it('renders a single `Email` input', () => {
      expect(login.findWhere(el => el.props().name === 'email').length).toEqual(1)
    })

    it('renders a single `Password` input', () => {
      expect(login.findWhere(el => el.props().name === 'password').length).toEqual(1)
    })

    it('renders a single Submit button', () => {
      expect(login.findWhere(el => el.props().type === 'submit').length).toEqual(1)
    })

    it('renders a single passwordless login button', () => {
      expect(login.findWhere(el => el.props().type === 'button').length).toEqual(1)
    })
  })

  describe('when nothing has been entered', () => {
    const inputValues = {}

    beforeEach(() => {
      login = makeNewShallow(inputValues)
      mockUserLogin.mockClear()
      mockShowNotification.mockClear()
    })

    describe('and user submits the form', () => {
      beforeEach(() => {
        const submitButton = login.findWhere(el => el.props().type === 'submit')
        submitButton.simulate('click')
      })

      it('dispatches the `showNotification()` action with exact message', () => {
        expect(mockShowNotification).toHaveBeenCalledTimes(1)
        expect(mockShowNotification).toHaveBeenCalledWith('Both fields are required')
      })

      it('does not dispatch any `userLogin()` actions', () => {
        expect(mockUserLogin).toHaveBeenCalledTimes(0)
      })
    })

    describe('and user clicks the passwordless login', () => {
      beforeEach(() => {
        const passwordlessButton = login.findWhere(el => el.props().type === 'button')
        passwordlessButton.simulate('click')
      })

      it('does not dispatch any `userLogin()` actions', () => {
        expect(mockUserLogin).toHaveBeenCalledTimes(0)
      })

      it('dispatches the `showNotification()` action with exact message', () => {
        expect(mockShowNotification).toHaveBeenCalledTimes(1)
        expect(mockShowNotification).toHaveBeenCalledWith('Email is required')
      })
    })
  })

  describe('when only email is entered', () => {
    const inputValues = { email: 'jest@test.fest' }

    beforeEach(() => {
      login = makeNewShallow(inputValues)
      mockUserLogin.mockClear()
      mockShowNotification.mockClear()
    })

    describe('and user submits the form', () => {
      beforeEach(() => {
        const submitButton = login.findWhere(el => el.props().type === 'submit')
        submitButton.simulate('click')
      })

      it('dispatches the `showNotification()` action with exact message', () => {
        expect(mockShowNotification).toHaveBeenCalledTimes(1)
        expect(mockShowNotification).toHaveBeenCalledWith('Both fields are required')
      })

      it('does not dispatch any `userLogin()` actions', () => {
        expect(mockUserLogin).toHaveBeenCalledTimes(0)
      })
    })

    describe('and user clicks the passwordless login', () => {
      beforeEach(() => {
        const passwordlessButton = login.findWhere(el => el.props().type === 'button')
        passwordlessButton.simulate('click')
      })

      it('dispatches the `userLogin()` action', () => {
        expect(mockUserLogin).toHaveBeenCalledTimes(1)
      })

      it('passes email as the only argument', () => {
        expect(mockUserLogin).toHaveBeenCalledWith(inputValues)
      })
    })
  })

  describe('when both email and password are entered', () => {
    const inputValues = { email: 'jest@test.fest', password: 'jestduit' }

    beforeEach(() => {
      login = makeNewShallow(inputValues)
      mockUserLogin.mockClear()
      mockShowNotification.mockClear()
    })

    describe('and user submits the form', () => {
      beforeEach(() => {
        const submitButton = login.findWhere(el => el.props().type === 'submit')
        submitButton.simulate('click')
      })

      it('dispatches the `userLogin()` action', () => {
        expect(mockUserLogin).toHaveBeenCalledTimes(1)
      })

      it('passes email and password as arguments', () => {
        expect(mockUserLogin).toHaveBeenCalledWith(inputValues)
      })
    })

    describe('and user clicks the passwordless login', () => {
      beforeEach(() => {
        const passwordlessButton = login.findWhere(el => el.props().type === 'button')
        passwordlessButton.simulate('click')
      })

      it('dispatches the `userLogin()` action', () => {
        expect(mockUserLogin).toHaveBeenCalledTimes(1)
      })

      it('passes email as the only argument', () => {
        expect(mockUserLogin).toHaveBeenCalledWith({ email: inputValues.email })
      })
    })
  })
})
