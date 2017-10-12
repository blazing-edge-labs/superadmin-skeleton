import React from 'react'
import {
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  DateField,
  required,
  email,
} from 'admin-on-rest'

const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id"/>
      <TextInput label="Email" source="email" validate={[required, email]}/>
      <DateField label="Created At" source="createdAt" showTime options={{ timeZoneName: 'short' }}/>
    </SimpleForm>
  </Edit>
)

export default UserEdit
