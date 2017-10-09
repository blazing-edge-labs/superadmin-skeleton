const form = {
  email: value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined,
  required: value =>
    !value ? 'Required' : undefined,
}

module.exports = {
  form,
}
