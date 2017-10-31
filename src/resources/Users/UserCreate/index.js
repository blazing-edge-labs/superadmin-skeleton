import React from 'react'
import {
  Create,
  SimpleForm,
  TextInput,
} from 'admin-on-rest'

const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" type="email"/>
      <TextInput source="password" type="password" default=""/>
    </SimpleForm>
  </Create>
)

export default UserCreate
