import randomKey from '../common/random-key';
import Card from './card';
import { RoleType } from './role-type';

export default class Player {
  public id?: string;
  public role: RoleType;
  public name: string;
  public vote: Card[];

  constructor (params: {
    id?: string,
    role: RoleType,
    name: string,
    vote?: Card[],
  }) {
    this.id = params.id || randomKey(params.name);
    this.role = params.role;
    this.name = params.name;
    this.vote = params.vote || [];
  }

  public get isAdmin (): boolean {
    return this.role === RoleType.ADMIN;
  }
}
