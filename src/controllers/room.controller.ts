import { PLAYER_ITEM } from '../common/constants';
import toast from '../common/toast';
import Card from '../models/card';
import Player from '../models/player';
import { RoleType } from '../models/role-type';
import Room from '../models/room';
import router from '../router';
import RoomSingletonService from '../services/room-service';
import RoomView from '../views/room.view';
import Controller from './controller';

export default class RoomController implements Controller {
  private view: RoomView;
  private votes: Card[];
  private currentPlayer: Player;
  private room: Room;
  private service: RoomSingletonService;

  constructor () {
    this.view = new RoomView();
    this.service = RoomSingletonService.getInstance();
    this.votes = [];
  }

  private async listPlayers () {
    this.view.listPlayers(this.room.players);
  }

  private lisStories () {
    this.view.generateCardsUserHistory(this.room.userStories);
  }

  public async init (id: string): Promise<void> {
    if (!await this.initRoom(id)) {
      return router.push('/');
    }
    if (!await this.initPlayer()) {
      return router.push('/', id);
    }
    this.view.render();
    this.service.listenCollection(id, 'timeRemaining').subscribe(
      (room: Room) => {
        if (room.timeRemaining) {
          this.view.openCardsDeck();
        } else {
          this.view.closeCardsDeck();
        }
        this.view.updateTimeReamining(room.timeRemaining, this.room.settings.timeout);
      },
    );
    this.listPlayers();
    this.lisStories();
    this.view.generateCardsDeck(
      this.room.settings.deck,
      this.insertVote.bind(this),
      this.validateCards.bind(this),
    );
    this.initAdminMode();
    this.onEnterPlayer(id);
  }

  private async initRoom (id: string): Promise<boolean> {
    this.view.showLoader('Obtendo dados da sala...');
    this.room = await this.service.findById(id);
    this.view.hideLoader();
    if (!this.room) {
      toast('Sala não encontrada!');
      return false;
    }
    return true;
  }

  private async initPlayer (): Promise<boolean> {
    const playerId = localStorage.getItem(PLAYER_ITEM);
    if (!playerId) {
      toast('Informe seu nome de jogador!');
      return false;
    }
    this.currentPlayer = this.room.players.find(
      (player) => player.id === playerId,
    );
    return true;
  }

  private initAdminMode (): void {
    if (this.currentPlayer.role === RoleType.ADMIN) {
      this.view.showInitGame(
        this.initializeCounter.bind(this),
      );
    }
  }

  private onEnterPlayer (id: string) {
    this.service.listenCollection(id, 'players').subscribe(
      ({ players }: any) => {
        this.room.players = players.map((player: any) => new Player(player));
        this.listPlayers();
      });
  }

  private insertVote (card: Card) {
    const index = this.findVoteIndex(card);
    if (index >= 0) {
      this.votes.splice(index, 1);
    } else {
      this.votes.push(card);
    }
  }

  private findVoteIndex (card: Card): number {
    return this.votes.findIndex((value) => value.symbol === card.symbol);
  }

  private validateCards (card: Card): boolean {
    if (!this.votes.length || this.findVoteIndex(card) >= 0) {
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
    this.room.timeRemaining = this.room.settings.timeout;
    const refreshId = setInterval(async () => {
      if (this.room.timeRemaining === 1) { clearInterval(refreshId); }
      this.room.timeRemaining--;
      await this.service.upsert(this.room);
    }, 1000);
  }
}
