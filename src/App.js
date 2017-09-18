import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import { Admin, Resource, Delete } from 'admin-on-rest'
import { UserList, UserEdit, UserCreate } from './Users'

import authClient from './authClient'
import restClient from './restClient'

const history = createHistory()

class App extends Component {
  render () {
    return (
      <Admin authClient={authClient} restClient={restClient} history={history}>
        <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} remove={Delete}/>
      </Admin>
    )
  }
}

export default App
