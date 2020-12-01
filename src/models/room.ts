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
  public timeRemaining?: number;

  constructor (params: {
    id?: string,
    title: string,
    identifier?: string,
    finished: boolean,
    settings?: Settings,
    players: Array<Player>,
    userStories: Array<UserStories>,
    timeRemaining?: number
  }) {
    this.id = params.id || randomKey(params.title);
    this.title = params.title;
    this.identifier = params.identifier;
    this.finished = params.finished;
    this.settings = params.settings || new Settings();
    this.players = params.players;
    this.userStories = params.userStories;
    this.timeRemaining = params.timeRemaining || 60;
  }
  // todas as fallbacks acimas foram colocadas pois o firebase não aceita Nenhum atributo undefined em seu banco
}
