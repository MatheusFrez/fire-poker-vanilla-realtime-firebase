import Card from '../models/card';
import Player from '../models/player';
import { RoleType } from '../models/role-type';
import UserStory from '../models/user-story';
import Vote from '../models/vote';
import RoomView from '../views/room.view';
import Controller from './controller';

export default class RoomController implements Controller {
  private view: RoomView;
  private vote: Vote;
  private votes: Card[]

  private players =[
    new Player({
      role: RoleType.ADMIN,
      name: 'Everton',
    }),
    new Player({
      role: RoleType.PLAYER,
      name: 'Lucas',
    }),
    new Player({
      role: RoleType.PLAYER,
      name: 'Matheus',
    }),
  ]

  private histories =
  [
    {
      name: 'Jogar um jogo',
      description: 'Como um jogador desejo jogar um jogo para jogar um jogo',
    },
    {
      name: 'Vencer um jogo',
      description: 'Como um jogador desejo jogar um jogo para jogar um jogo',
    },
    {
      name: 'Jogar um jogo',
      description: 'Como um jogador desejo jogar um jogo para jogar um jogo',
    },

  ]

  constructor () {
    this.view = new RoomView();
    // this.vote = new Vote();
    this.votes = [];
  }

  public init (id: string): void {
    this.view.render(id);
    this.view.generateCardsDeck(
      this.insertVote.bind(this),
      this.validateCards.bind(this),
      this.getCountVote.bind(this),
    );
    this.view.listPlayers(this.players as Player[]);
    this.view.generateCardsUserHistory(this.histories as UserStory[]);
  }

  private insertVote (card: Card) {
    const index = this.findIndex(card);
    if (index >= 0) {
      this.votes.splice(index, 1);
    } else {
      this.votes.push(card);
    }
  }

  private findIndex (card: Card): number {
    return this.votes.findIndex((value) => value.symbol === card.symbol);
  }

  private validateCards (card: Card): boolean {
    return true;
  }

  public getCountVote (): number | string {
    return this.hasSpecialCard() ? this.votes[0].symbol : (this.votes.reduce((acc, card) => acc + card.value, 0));
  }

  private hasSpecialCard (): boolean {
    return !!this.votes.find((value) => value.description);
  }
}
