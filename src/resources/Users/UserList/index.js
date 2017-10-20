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
  TextInput,
} from 'admin-on-rest'

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Email" source="email"/>
  </Filter>
)

const UserList = (props) => (
  <List
    {...props}
    perPage={10}
    sort={{ field: 'id', order: 'ASC' }}
    filters={<UserFilter/>}
  >
    <Datagrid>
      <TextField source="id"/>
      <EmailField source="email"/>
      <DateField source="createdAt" label="Created At" showTime options={{ timeZoneName: 'short' }}/>
      <EditButton/>
      <DeleteButton/>
    </Datagrid>
  </List>
)

export default UserList
