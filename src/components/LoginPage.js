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

import { Notification, userLogin, showNotification } from 'admin-on-rest'

import valid from '../utils/validations'

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

class PasswordlessLoginPage extends Component {
  constructor (props) {
    super(props)

    this.confirmTokenAuth = this.confirmTokenAuth.bind(this)
    this.sendLink = this.sendLink.bind(this)
    this.login = this.login.bind(this)
  }

  componentDidMount () {
    if (this.props.URLQuery) {
      this.confirmTokenAuth()
    }
  }

  confirmTokenAuth () {
    const token = (new URLSearchParams(this.props.URLQuery)).get('t')
    if (token) this.props.userLogin({ token })
  }

  sendLink ({ email }) {
    if (!email) return showNotification('Email is required')
    this.props.userLogin({ email })
  }

  login ({ email, password }) {
    if (email && password) {
      this.props.userLogin({ email, password })
    } else {
      this.props.showNotification('Both fields are required')
    }
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
            <form>
              <div style={styles.form}>
                <div style={styles.input}>
                  <Field
                    name="email"
                    type="email"
                    component={renderInput}
                    floatingLabelText="Email"
                    validate={[valid.form.email, valid.form.required]}
                  />
                </div>
              </div>
              <CardActions>
                <RaisedButton
                  type="button"
                  primary
                  disabled={submitting}
                  label="Send magic link"
                  fullWidth
                  onClick={handleSubmit(this.sendLink)}
                />
              </CardActions>
              <div style={styles.form}>
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
                  label="Sign in with password"
                  fullWidth
                  onClick={handleSubmit(this.login)}
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

PasswordlessLoginPage.propTypes = {
  ...propTypes,
  userLogin: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
}

function mapStateToProps (state, routerState) {
  return ({
    URLQuery: routerState.location.search,
  })
}

const enhance = compose(
  reduxForm({
    form: 'signIn',
  }),
  connect(mapStateToProps, { userLogin, showNotification }),
)

export default enhance(PasswordlessLoginPage)
