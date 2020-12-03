import { CARD_DEFAULT, PLAYER_ITEM } from '../common/constants';
import toast from '../common/toast';
import Card from '../models/card';
import Player from '../models/player';
import { RoleType } from '../models/role-type';
import Room from '../models/room';
import Round from '../models/round';
import Vote from '../models/vote';
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
  private timerInterval: any;

  constructor () {
    this.view = new RoomView();
    this.service = RoomSingletonService.getInstance();
    this.votes = [];
  }

  private listPlayers (): void {
    this.view.listPlayers(this.room.players);
  }

  private lisStories (): void {
    this.view.generateCardsUserHistory(this.room.pendingUserStories);
  }

  private listDeck (): void {
    this.view.generateCardsDeck(
      this.room.settings.deck,
      this.insertVote.bind(this),
      this.validateCards.bind(this),
    );
  }

  public async init (id: string): Promise<void> {
    if (!await this.initRoom(id)) {
      localStorage.clear();
      return router.push('/');
    }
    if (!await this.initPlayer()) {
      return router.push('/', id);
    }
    this.view.render();
    this.listPlayers();
    this.lisStories();
    this.listDeck();
    this.initAdminMode();
    this.onEnterPlayer(id);
    this.listenForStartRound(id);
    this.listenForFinishRound(id);
    this.listenForTimer(id);
    this.listenForVotes(id);
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
    const currentPlayer = this.room.players.find(
      (player) => player.id === playerId,
    );
    this.currentPlayer = new Player(currentPlayer);
    return true;
  }

  private initAdminMode (): void {
    if (this.currentPlayer.role === RoleType.ADMIN) {
      this.view.showInitGame(
        this.nextRound.bind(this),
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

  private initializeCounter (): void {
    this.timerInterval = setInterval(() => {
      this.room.round.timeRemaining--;
      this.service.upsert(this.room);
      const timeover: boolean = this.room.round.timeRemaining === 0;
      if (timeover && !this.everyoneVoted) {
        this.setDefaultVotes();
      }
    }, 1000);
  }

  private async nextRound (): Promise<void> {
    const [nextUserStory] = this.room.pendingUserStories;
    const round: Round = new Round({
      timeRemaining: this.room.settings.timeout,
      votes: [],
      userStory: nextUserStory,
      started: true,
    });
    this.room.round = round;
    await this.service.upsert(this.room);
  }

  private setDefaultVotes (): void {
    if (!this.room.round.votes) {
      this.room.round.votes = [];
    }
    this.room.players.forEach((player) => {
      const voted: boolean = this.room.round.votes.some(
        (vote) => vote.player.id === player.id,
      );
      if (!voted) {
        const defaultVoute: Vote = new Vote({
          player,
          cards: [CARD_DEFAULT],
        });
        this.room.round.votes.push(defaultVoute);
      }
    });
  }

  private async finishRound (): Promise<void> {
    if (this.room.finished) {
      return;
    }
    clearInterval(this.timerInterval);
    this.room.round.started = false;
    this.room.round.finished = true;
    this.room.round.timeRemaining = this.room.settings.timeout;
    await this.service.upsert(this.room);
  }

  private listenForVotes (id: string): void {
    this.service.listenCollection(id, 'round/votes').subscribe(
      (round: Round) => {
        if (!round.votes) {
          return;
        }
        this.room.round = round;
        if (this.everyoneVoted) {
          this.finishRound();
        }
      },
    );
  }

  private listenForStartRound (id: string): void {
    this.service.listenCollection(id, 'round/started').subscribe(
      (round: Round) => {
        if (round.started) {
          this.view.openCardsDeck();
          if (this.currentPlayer.isAdmin) {
            this.initializeCounter();
          }
        }
      },
    );
  }

  private listenForFinishRound (id: string): void {
    this.service.listenCollection(id, 'round/finished').subscribe(
      (round: Round) => {
        if (round.finished) {
          this.view.closeCardsDeck();
        }
      },
    );
  }

  private listenForTimer (id: string): void {
    this.service.listenCollection(id, 'round/timeRemaining').subscribe(
      (round: Round) => {
        this.view.updateTimeReamining(
          round.timeRemaining,
          this.room.settings.timeout,
        );
      },
    );
  }

  private get everyoneVoted (): boolean {
    return this.room.round.votes?.length === this.room.players.length;
  }
}
