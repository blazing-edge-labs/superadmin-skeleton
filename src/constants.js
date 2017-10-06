export const USER_ROLE_SUPERADMIN = 'superadmin'

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
