import { Tooltip } from 'materialize-css';
import Card from '../models/card';
import Player from '../models/player';
import Room from '../models/room';
import UserStory from '../models/user-story';
import RoomSingletonService from '../services/room-service';
import RoomView from '../views/room.view';
import Controller from './controller';

export default class RoomController implements Controller {
  private view: RoomView;
  private votes: Card[];
  private service: RoomSingletonService;
  private roomId: string;
  private playersTest =
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
    {
      role: 'player',
      name: 'Wellington',
    },
    {
      role: 'player',
      name: 'Sei la',
    },
  ]

  private histories: Array<UserStory> | Promise<Array<UserStory>> = []

  constructor () {
    this.view = new RoomView();
    this.service = RoomSingletonService.getInstance();
    this.votes = [];
    this.roomId = window.location.pathname.replace('/room/', '');
  }

  private async initializePlayersByRoomName (roomName: string) {
    this.service.findById(roomName)
      .then(internalRoom => internalRoom.players)
      .then((players: Player[]) => this.view.listPlayers(players));
  }

  private async initializeStoriesByRoomName (roomName: string) {
    this.service.findById(roomName)
      .then(internalRoom => internalRoom.userStories)
      .then((histories: UserStory[]) => this.view.generateCardsUserHistory(histories));
  }

  public async init (id: string): Promise<void> {
    const roomId: string = window.location.pathname.replace('/room/', '');

    this.service.listenCollection(roomId, 'timeRemaining').subscribe(
      (room: Room) => {
        if (room.timeRemaining === 59) {
          this.view.openCardsDeck();
        }
        this.view.updateTimeReamining(room.timeRemaining?.toString());
        if (room.timeRemaining === 0) {
          console.log('CABOU O TEMPO DA SALA'); // TO DO fazer algo quando acontece isso
          this.view.closeCardsDeck();
        }
      },
    );

    Tooltip.init(document.querySelectorAll('.tooltipped'), {}); // TIRAR DAQUI
    this.initializePlayersByRoomName(this.roomId);
    this.initializeStoriesByRoomName(this.roomId);
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

    this.view.generateCardsUserHistory(this.histories as UserStory[]);
    this.view.onClickShowPlayersModal(this.playersTest as Player[]);
    this.view.onClickShowHistoriesModal(this.histories as UserStory[]);
    this.view.onClickConfirmPlay(this.initializeCounter.bind(this));
    this.onEnterPlayer();

    if (localStorage.getItem('player-id') === 'numero2-05r8f') {
      this.view.generateBackdropAdmin(this.initializeCounter.bind(this));
    } /// Fazer a verificação aqui pra ver o admin

    Tooltip.init(document.querySelectorAll('.tooltipped'), {}); // TIRAR DAQUI
  }

  onEnterPlayer () {
    this.service.listenCollection(this.roomId, 'players').subscribe(
      ({ players }: any) => { // Tirar isso aki
        this.view.listPlayers(players);
      });
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
    if (!this.votes.length || this.findIndex(card) >= 0) {
      return true;
    } else {
      if ((card.description && this.votes.length > 0) || (card.value && this.hasSpecialCard())) {
        return false;
      }
      return true;
    }
  }

  public getCountVote (): number | string {
    return this.hasSpecialCard() ? this.votes[0].symbol : (this.votes.reduce((acc, card) => acc + card.value, 0));
  }

  private hasSpecialCard (): boolean {
    return !!this.votes.find((value) => value.description);
  }

  private async initializeCounter () {
    const roomToUpdate: Room = await this.service.findById(this.roomId);
    roomToUpdate.timeRemaining = roomToUpdate.settings.timeout;
    const refreshId = setInterval(async () => {
      if (roomToUpdate.timeRemaining === 1) { clearInterval(refreshId); }
      roomToUpdate.timeRemaining--;
      await this.service.upsert(roomToUpdate);
    }, 1000);
  }
}
