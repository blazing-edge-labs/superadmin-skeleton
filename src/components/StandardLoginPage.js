import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { propTypes, reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import compose from 'recompose/compose'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { Card, CardActions } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import LockIcon from 'material-ui/svg-icons/action/lock-outline'
import { cyan500, pinkA200 } from 'material-ui/styles/colors'

import { Notification, userLogin } from 'admin-on-rest'

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    minWidth: 300,
  },
  avatar: {
    margin: '1em',
    textAlign: 'center ',
  },
  form: {
    padding: '0 1em 1em 1em',
  },
  input: {
    display: 'flex',
  },
}

function getColorsFromTheme (theme) {
  if (!theme) return { primary1Color: cyan500, accent1Color: pinkA200 }
  const {
    palette: {
      primary1Color,
      accent1Color,
    },
  } = theme
  return { primary1Color, accent1Color }
}

const renderInput = ({ meta: { touched, error } = {}, input, type = 'text', ...props }) =>
  <TextField
    errorText={touched && error}
    {...input}
    {...props}
    type={type}
  />

class StandardLoginPage extends Component {
  login = (credentials) => {
    const { userLogin, location } = this.props
    userLogin(credentials, location.state ? location.state.nextPathname : '/')
  }

  render () {
    const { handleSubmit, submitting } = this.props
    const muiTheme = getMuiTheme()
    const { primary1Color, accent1Color } = getColorsFromTheme(muiTheme)

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={{ ...styles.main, backgroundColor: primary1Color }}>
          <Card style={styles.card}>
            <div style={styles.avatar}>
              <Avatar backgroundColor={accent1Color} icon={<LockIcon/>} size={60}/>
            </div>
            <form onSubmit={handleSubmit(this.login)}>
              <div style={styles.form}>
                <div style={styles.input}>
                  <Field
                    name="email"
                    component={renderInput}
                    floatingLabelText="Email"
                  />
                </div>
                <div style={styles.input}>
                  <Field
                    name="password"
                    component={renderInput}
                    floatingLabelText="Password"
                    type="password"
                  />
                </div>
              </div>
              <CardActions>
                <RaisedButton
                  type="submit"
                  primary
                  disabled={submitting}
                  label="Sign in"
                  fullWidth
                />
              </CardActions>
            </form>
          </Card>
          <Notification/>
        </div>
      </MuiThemeProvider>
    )
  }
}

StandardLoginPage.propTypes = {
  ...propTypes,
  userLogin: PropTypes.func.isRequired,
}

const enhance = compose(
  reduxForm({
    form: 'signIn',
    validate: (values) => {
      const errors = {}
      if (!values.email) errors.email = 'Required'
      if (!values.password) errors.password = 'Required'
      return errors
    },
  }),
  connect(null, { userLogin }),
)

export default enhance(StandardLoginPage)
