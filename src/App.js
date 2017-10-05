import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import { Admin, Resource, Delete } from 'admin-on-rest'
import { UserList, UserEdit, UserCreate } from './resources/Users'

import PasswordlessLoginPage from './components/PasswordlessLoginPage'

import authClient from './clients/authClient'
import restClient from './clients/restClient'

const history = createHistory()

class App extends Component {
  render () {
    return (
      <Admin loginPage={PasswordlessLoginPage} authClient={authClient} restClient={restClient} history={history}>
        <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} remove={Delete}/>
      </Admin>
    )
  }
}

export default App
