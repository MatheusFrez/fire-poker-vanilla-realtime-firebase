import { CARD_DEFAULT, PLAYER_ITEM } from '../common/constants';
import toast from '../common/toast';
import Card from '../models/card';
import Player from '../models/player';
import Room from '../models/room';
import Round from '../models/round';
import UserStory from '../models/user-story';
import Vote from '../models/vote';
import router from '../router';
import RoomSingletonService from '../services/room-service';
import RoundService from '../services/round-service';
import RoomView from '../views/room.view';
import Controller from './controller';

export default class RoomController implements Controller {
  private view: RoomView;
  private currentPlayer: Player;
  private room: Room;
  private service: RoomSingletonService;
  private roundService: RoundService;
  private timerInterval: any;

  constructor () {
    this.view = new RoomView();
    this.service = RoomSingletonService.getInstance();
  }

  private showCurrentPlayerWithVotes (): void {
    this.view.showCurrentPlayer(this.currentPlayer);
  }

  private listPlayersWithVotes (): void {
    const players = this.room.players
      .filter(
        (player) => player.id !== this.currentPlayer.id,
      )
      .map((player) => {
        const vote = this.room.round?.votes?.find(
          (vote) => vote.player.id === player.id,
        );
        return new Player({
          ...player,
          vote: vote?.cards,
        });
      });
    this.view.listPlayers(players);
  }

  private lisStories (): void {
    this.view.generateCardsUserHistory(this.room.pendingUserStories || []);
  }

  private listDeck (): void {
    this.view.generateCardsDeck(
      this.room.settings.deck,
      this.insertVote.bind(this),
    );
  }

  public async init (id: string): Promise<void> {
    if (!await this.initRoom(id)) {
      localStorage.clear();
      return router.push('/');
    }
    if (this.room.finished) {
      this.navigateToFinishRoute();
      return;
    }
    if (!await this.initPlayer()) {
      return router.push('/', id);
    }
    this.view.render();
    this.view.hideCurrentResultStorie();
    this.showCurrentPlayerWithVotes();
    this.listPlayersWithVotes();
    this.lisStories();
    this.listDeck();
    this.initAdminMode();
    this.listenForFinishGame(id);
    this.listenForPlayers(id);
    this.listenForPendingStories(id);
    this.listenForStartRound();
    this.listenForFinishRound();
    this.listenForTimer();
    this.listenForVotes();
  }

  private navigateToFinishRoute (): void {
    router.push(`/room/${this.room.id}/end`);
  }

  private async initRoom (id: string): Promise<boolean> {
    this.view.showLoader('Obtendo dados da sala...');
    this.room = await this.service.findById(id);
    this.view.hideLoader();
    if (!this.room) {
      toast('Sala não encontrada!');
      return false;
    }
    this.roundService = new RoundService(this.room);
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
    const vote = this.room.round?.votes?.find(
      (vote) => vote.player.id === playerId,
    );
    this.currentPlayer = new Player({
      ...currentPlayer,
      vote: vote?.cards,
    });
    return true;
  }

  private initAdminMode (): void {
    if (!this.currentPlayer.isAdmin) {
      return;
    }
    if (!this.room.pendingUserStories?.length) {
      this.view.showFinish(this.finishGame.bind(this));
    } else if (!this.room.round) {
      this.view.showInitGame(this.nextRound.bind(this));
    } else {
      this.view.showNext(this.nextRound.bind(this));
    }
  }

  private listenForPlayers (id: string) {
    this.service.listenCollection(id, 'players').subscribe(
      (players: any[]) => {
        this.room.players = players.map((player: any) => new Player(player));
        this.listPlayersWithVotes();
      },
    );
  }

  private async confirmVote (): Promise<void> {
    if (!this.currentPlayerHasVote) {
      toast('Selecione ao menos uma carta!');
      return;
    }
    this.roundService.inserVote(new Vote({
      player: this.currentPlayer,
      cards: this.currentPlayer.vote,
    }));
    this.view.hideConfirm();
    await this.service.upsert(this.room);
  }

  private insertVote (card: Card): boolean {
    if (!this.room.round.started) {
      return false;
    }
    let result = false;
    const index = this.currentPlayer.vote.findIndex(
      (value) => value.symbol === card.symbol,
    );
    if (index >= 0) {
      this.currentPlayer.vote.splice(index, 1);
      result = true;
    } else {
      result = this.validateCards(card);
      if (result) {
        this.currentPlayer.vote.push(card);
      }
    }
    this.showCurrentPlayerWithVotes();
    return result;
  }

  private validateCards (card: Card): boolean {
    const votesIsNotEmpty = this.currentPlayer.vote.length > 0;
    if ((card.isSpecial && votesIsNotEmpty) || (!card.isSpecial && this.hasSpecialCard())) {
      return false;
    }
    return true;
  }

  private hasSpecialCard (): boolean {
    return !!this.currentPlayer.vote.some((card) => card.isSpecial);
  }

  private initializeCounter (): void {
    this.timerInterval = setInterval(() => {
      const timeover: boolean = this.room.round.timeRemaining === 0;
      if (timeover && !this.everyoneVoted) {
        this.setDefaultVotes();
      }
      if (timeover) {
        clearInterval(this.timerInterval);
        return;
      }
      this.room.round.timeRemaining--;
      this.service.upsert(this.room);
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
    this.view.hideCurrentResultStorie();
    await this.service.upsert(this.room);
  }

  private setDefaultVotes (): void {
    this.room.players.forEach((player) => {
      const voted: boolean = this.room.round.votes.some(
        (vote) => vote.player.id === player.id,
      );
      if (!voted) {
        const defaultVoute: Vote = new Vote({
          player,
          cards: [CARD_DEFAULT],
        });
        this.roundService.inserVote(defaultVoute);
      }
    });
  }

  private setDefaultIfCurrentPlayerNotVote (): void {
    if (!this.currentPlayerHasVote) {
      this.currentPlayer.vote = [CARD_DEFAULT];
      this.showCurrentPlayerWithVotes();
    }
  }

  private clearVotes (): void {
    this.currentPlayer.vote = [];
    this.showCurrentPlayerWithVotes();
    this.listPlayersWithVotes();
  }

  private updatePendingStories (): void {
    this.view.hideCurrentUserStory();
    setTimeout(() => {
      this.lisStories();
    }, 3000);
  }

  private async movePendingToEstimated (): Promise<void> {
    this.room.pendingUserStories.shift();
    const estimated: UserStory = new UserStory({
      ...this.room.round.userStory,
      result: this.room.round.result,
      votes: this.room.round.votes,
    });
    if (!this.room.estimatedUserStories) {
      this.room.estimatedUserStories = [];
    }
    this.room.estimatedUserStories.push(estimated);
    await this.service.upsert(this.room);
    this.updatePendingStories();
  }

  private async finishGame (): Promise<void> {
    this.room.finished = true;
    await this.service.upsert(this.room);
  }

  private async finishRound (): Promise<void> {
    if (this.room.round.finished) {
      return;
    }
    clearInterval(this.timerInterval);
    this.room.round.started = false;
    this.room.round.finished = true;
    this.room.round.timeRemaining = this.room.settings.timeout;
    await this.service.upsert(this.room);
    // TODO: Verificar concenso
    await this.movePendingToEstimated();
    if (!this.room.pendingUserStories.length) {
      this.view.showFinish(this.finishGame.bind(this));
    } else {
      this.view.showNext(this.nextRound.bind(this));
    }
  }

  private listenForPendingStories (id: string): void {
    this.service.listenCollection(id, 'pendingUserStories').subscribe(
      (pendingUserStories: UserStory[]) => {
        if (pendingUserStories === null) {
          return;
        }
        if (pendingUserStories.length < this.room.pendingUserStories.length) {
          this.room.pendingUserStories = pendingUserStories;
          this.updatePendingStories();
        }
      },
    );
  }

  private listenForVotes (): void {
    this.roundService.listenForVotes().subscribe((votes: Vote[]) => {
      this.room.round = new Round({
        ...this.room.round,
        votes,
      });
      this.listPlayersWithVotes();
      if (this.currentPlayer.isAdmin && this.everyoneVoted) {
        this.finishRound();
      }
    });
  }

  private listenForStartRound (): void {
    this.roundService.listenForStarted().subscribe((started: boolean) => {
      this.room.round = new Round({
        ...this.room.round,
        started,
      });
      this.clearVotes();
      this.view.openCardsDeck();
      this.view.showConfirm(this.confirmVote.bind(this));
      if (this.currentPlayer.isAdmin) {
        this.initializeCounter();
      }
    });
  }

  private listenForFinishRound (): void {
    this.roundService.listenForFinished().subscribe((finished: boolean) => {
      this.room.round = new Round({
        ...this.room.round,
        finished,
      });
      this.setDefaultIfCurrentPlayerNotVote();
      this.view.closeCardsDeck();
      this.showGraphAndResults();
      this.view.hideConfirm();
    });
  }

  private showGraphAndResults () {
    this.view.showStorieResultAndGraph(this.room);
  }

  private listenForTimer (): void {
    this.roundService.listenForTimer().subscribe((timeRemaining: number) => {
      this.view.updateTimeRemaining(
        timeRemaining,
        this.room.settings.timeout,
      );
    });
  }

  private listenForFinishGame (id: string): void {
    this.service.listenCollection(id, 'finished').subscribe((finished: boolean) => {
      if (finished) {
        this.navigateToFinishRoute();
      }
    });
  }

  private get currentPlayerHasVote (): boolean {
    return !!this.currentPlayer.vote.length;
  }

  private get everyoneVoted (): boolean {
    return this.room.round.votes?.length >= this.room.players.length;
  }
}
