import React from 'react'

import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  EditButton,
  DeleteButton,
  Filter,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  Create,
  required,
  email,
} from 'admin-on-rest'

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Email" source="email"/>
  </Filter>
)

export const UserList = (props) => (
  <List
    {...props}
    perPage={5}
    sort={{field: 'id', order: 'ASC'}}
    filters={<UserFilter/>}
  >
    <Datagrid>
      <TextField source="id"/>
      <EmailField source="email"/>
      <DateField source="createdAt" label="Created At" showTime options={{timeZoneName: 'short'}}/>
      <EditButton/>
      <DeleteButton/>
    </Datagrid>
  </List>
)

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id"/>
      <TextInput label="Email" source="email" validate={[required, email]}/>
      <DateField label="Created At" source="createdAt" showTime options={{timeZoneName: 'short'}}/>
    </SimpleForm>
  </Edit>
)

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" type="email"/>
      <TextInput source="password" type="password" default=""/>
    </SimpleForm>
  </Create>
)
