import React, { Component } from 'react'
import { Admin, Resource, Delete } from 'admin-on-rest'
import createHistory from 'history/createBrowserHistory'
import { UserList, UserEdit, UserCreate } from './Users'
import myApiRestClient from './restClient'

const history = createHistory()

class App extends Component {
  render () {
    return (
      <Admin restClient={myApiRestClient} history={history}>
        <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} remove={Delete}/>
        <Resource name="user_role" list={UserRoleList}/>
      </Admin>
    )
  }
}

export default App
