import randomKey from '../common/random-key';
import Player from './player';
import Settings from './settings';
import UserStories from './user-story';

export default class Room {
  public id: string;
  public title: string;
  public identifier: string;
  public finished: boolean;
  public settings?: Settings;
  public players: Array<Player>;
  public userStories: Array<UserStories>;

  constructor (params: {
    id?: string,
    title: string,
    identifier?: string,
    finished: boolean,
    settings?: Settings,
    players: Array<Player>,
    userStories: Array<UserStories>
  }) {
    this.id = params.id || randomKey(params.title);
    this.title = params.title;
    this.identifier = params.identifier;
    this.finished = params.finished;
    this.settings = params.settings || new Settings();
    this.players = params.players;
    this.userStories = params.userStories;
  }
}
