import randomKey from '../common/random-key';
import { RoleType } from './role-type';

export default class Player {
  public id?: string;
  public role: RoleType;
  public name: string;

  constructor (params: {
    id?: string,
    role: RoleType,
    name: string
  }) {
    this.id = params.id || randomKey(params.name);
    this.role = params.role;
    this.name = params.name;
  }
}
