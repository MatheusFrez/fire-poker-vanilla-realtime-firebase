import UserStory from './user-story';
import Vote from './vote';

export default class Round {
  public userStory: UserStory;
  public votes: Array<Vote>;
  public timeRemaining: number;
  public result: number;
  public started: boolean;
  public finished: boolean;
  public attempts: number;

  constructor (params: {
    userStory: UserStory,
    votes: Array<Vote>,
    timeRemaining: number,
    result?: number,
    finished?: boolean,
    started?: boolean,
    attempts?: number,
  }) {
    this.userStory = params.userStory;
    this.votes = params.votes;
    this.timeRemaining = params.timeRemaining;
    this.result = params.result;
    this.started = params.started || false;
    this.finished = params.finished || false;
    this.attempts = params.attempts || 1;
  }
}
