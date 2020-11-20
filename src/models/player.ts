export default class Player {
  public id?: string;
  public role: string;
  public name: string;

  constructor (params: {
    id?: string,
    role: string,
    name: string
  }) {
    this.id = params.id;
    this.role = params.role;
    this.name = params.name;
  }
}
