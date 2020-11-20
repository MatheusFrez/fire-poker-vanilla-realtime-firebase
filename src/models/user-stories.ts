import Vote from './vote';

export default class UserStories {
  public id?: string;
  public description: string;
  public name: string;
  public order: number;
  public result?: number;
  public votes?: Array<Vote>;

  constructor (params: {
    id?: string,
    role: string,
    name: string,
    order: number,
    result?: number,
    votes?: Array<Vote>
  }) {
    this.id = params.id;
    this.description = params.role;
    this.name = params.name;
    this.order = params.order;
    this.result = params.result;
    this.votes = params.votes;
  }
}
