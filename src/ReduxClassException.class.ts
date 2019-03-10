export class ReduxClassException {
  public error = ''
  public message = ''
  constructor(error: string, message = '') {
    this.error = error
    this.message = message
  }
}
