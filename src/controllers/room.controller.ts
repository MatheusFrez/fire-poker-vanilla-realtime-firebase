import { Tooltip } from 'materialize-css';
import Card from '../models/card';
import Player from '../models/player';
import Room from '../models/room';
import UserStory from '../models/user-story';
import Vote from '../models/vote';
import RoomSingletonService from '../services/room-service';
import RoomView from '../views/room.view';
import Controller from './controller';

export default class RoomController implements Controller {
  private view: RoomView;
  private vote: Vote;
  private votes: Card[]
  private service: RoomSingletonService;

  private players: Array<Player> | Promise<Array<Player>> = []

  private histories: Array<UserStory> | Promise<Array<UserStory>> = []

  constructor () {
    this.view = new RoomView();
    this.service = RoomSingletonService.getInstance();
    this.votes = [];

    setTimeout(() => {
      document.querySelectorAll('.stack').forEach((element:Element) => {
        element.classList.remove('stack-center');
      });
      document.getElementById('card-stacks').classList.toggle('transition');
    }, 500);
  }

  private async initializePlayersByRoomName (roomName: string) {
    const players: Promise<Array<Player>> = this.service.findById(roomName)
      .then(internalRoom => internalRoom.players);
    this.players = players || [];
  }

  private async initializeStoriesByRoomName (roomName: string) {
    const stories: Promise<Array<UserStory>> = this.service.findById(roomName)
      .then(internalRoom => internalRoom.userStories);
    this.histories = stories || [];
  }

  public async init (id: string): Promise<void> {
    const roomId: string = window.location.pathname.replace('/room/', '');

    this.service.listenCollection(roomId, 'timeRemaining').subscribe(
      (room: Room) => {
        this.view.updateTimeReamining(room.timeRemaining.toString());
        if (room.timeRemaining === 0) {
          console.log('CABOU O TEMPO DA SALA'); // TO DO fazer algo quando acontece isso
        }
      },
    );

    Tooltip.init(document.querySelectorAll('.tooltipped'), {}); // TIRAR DAQUI
    this.initializePlayersByRoomName(roomId);
    this.initializeStoriesByRoomName(roomId);
    this.view.render(id);
    this.view.generateCardsDeck(
      this.insertVote.bind(this),
      this.validateCards.bind(this),
      this.getCountVote.bind(this),
    );
    this.view.generateCardsDeckMobile(
      this.insertVote.bind(this),
      this.validateCards.bind(this),
      this.getCountVote.bind(this));
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
