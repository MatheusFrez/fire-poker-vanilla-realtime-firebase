export default class Settings {
  public id?: string
  public timeout: number

  constructor (params: {
    id?: string,
    timeout: number
  }) {
    this.id = params.id;
    this.timeout = params.timeout;
  }
}
