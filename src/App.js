import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import {
  Admin,
  Resource,
  Delete,
} from 'admin-on-rest'

import LoginPage from './containers/Login'
import authClient from './clients/authClient'
import restClient from './clients/restClient'

import UserList from './components/Users/UserList'
import UserEdit from './components/Users/UserEdit'
import UserCreate from './components/Users/UserCreate'

const history = createHistory()

class App extends Component {
  render () {
    return (
      <Admin loginPage={LoginPage} authClient={authClient} restClient={restClient} history={history}>
        <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} remove={Delete}/>
      </Admin>
    )
  }
}

export default App
