
export default class ReduxClassException {
  constructor(error, message = '') {
    this.error = error
    this.message = message
  }
  error = ''
  message = ''
}