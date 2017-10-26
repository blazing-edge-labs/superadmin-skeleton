export const USER_ROLE_SUPERADMIN = 20

export const API_ERROR_CODES = {
  // http
  400: 'Bad Request',
  401: 'Unauthorized',
  500: 'Internal Error',
  // user
  2001: 'Wrong password',
  2002: 'Invalid password',
  2003: 'User not found',
  2004: 'Duplicate user',
  2006: 'Invalid token',
  // role
  4002: 'Your need more power!',
}

export const API_ROUTES = {
  auth: {
    password_login: '/auth',
    passwordless_request: '/signin',
    passwordless_confirm: '/auth/token',
  },
  rest: {
    // todo: refactor restClient if possible when writing tests for this part
  },
}
