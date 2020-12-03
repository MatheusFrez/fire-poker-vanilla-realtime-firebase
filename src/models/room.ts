import randomKey from '../common/random-key';
import Player from './player';
import Round from './round';
import Settings from './settings';
import UserStories from './user-story';

export default class Room {
  public id: string;
  public title: string;
  public finished: boolean;
  public settings: Settings;
  public players: Array<Player>;
  public pendingUserStories: Array<UserStories>;
  public estimatedUserStories: Array<UserStories>;
  public round: Round;

  constructor (params: {
    id?: string,
    title: string,
    finished: boolean,
    settings?: Settings,
    players: Array<Player>,
    pendingUserStories: Array<UserStories>,
    round?: Round,
  }) {
    this.id = params.id || randomKey(params.title);
    this.title = params.title;
    this.finished = params.finished;
    this.settings = params.settings || new Settings();
    this.players = params.players;
    this.pendingUserStories = params.pendingUserStories;
    this.round = params.round;
  }
}
