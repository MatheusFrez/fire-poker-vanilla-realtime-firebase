import { Tooltip } from 'materialize-css';
import Card from '../models/card';
import Player from '../models/player';
import UserStory from '../models/user-story';
import Vote from '../models/vote';
import RoomView from '../views/room.view';
import Controller from './controller';

export default class RoomController implements Controller {
  private view: RoomView;
  private vote: Vote;
  private votes: Card[]

  private players =
  [
    {
      role: 'admin',
      name: 'Everton',
    },
    {
      role: 'player',
      name: 'Lucas',
    },
    {
      role: 'player',
      name: 'Matheus',
    },
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
    setTimeout(() => {
      document.querySelectorAll('.stack').forEach((element:Element) => {
        element.classList.remove('stack-center');
      });
      document.getElementById('card-stacks').classList.toggle('transition');
    }, 500);
  }

  public init (id: string): void {
    this.view.render(id);
    this.view.generateCardsDeck(this.insertVote.bind(this));
    this.view.generateCardsDeckMobile(this.insertVote.bind(this));
    this.view.listPlayers(this.players as Player[]);
    this.view.generateCardsUserHistory(this.histories as UserStory[]);

    Tooltip.init(document.querySelectorAll('.tooltipped'), {}); // TIRAR DAQUI
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
}
