import HomeView from '../views/home.view';
import Controller from './controller';
import router from '../router/index';
import RoomSingletonService from '../services/room-service';
import Room from '../models/room';
import ToastView from '../views/toast-view';
import Player from '../models/player';
import { RoleType } from '../models/role-type';

export default class HomeController implements Controller {
  private view: HomeView;
  private service: RoomSingletonService;
  private toastView: ToastView;

  constructor () {
    this.view = new HomeView();
    this.toastView = new ToastView();
    this.service = RoomSingletonService.getInstance();
  }

  public init (): void {
    this.view.render();
    this.view.onCreateRoom(() => this.create());
    this.view.onJoinRoom(() => this.join());

    const playerIdOnStorage: string = localStorage.getItem('player-id');
    const lastRoomOnStorage: string = localStorage.getItem('last-room');
    if (playerIdOnStorage && lastRoomOnStorage) this.redirectToGameRoom(lastRoomOnStorage); // Usuário caiu da sala e abriu o navegador novamente
  }

  private redirectToGameRoom (roomId: string) {
    router.push(`/room/${roomId}`);
  }

  private create (): void {
    const playerName: string = this.view.playerName;
    const roomName: string = this.view.roomName;
    const isValid: boolean = this.validate(playerName, roomName);
    if (isValid) {
      router.push(`/room/register?name=${playerName}&room=${roomName}`);
    }
  }

  private async join (): Promise<void> {
    const playerName: string = this.view.playerName;
    const roomId: string = this.view.roomName;
    if (!this.validate(playerName, roomId)) return;

    const roomToJoin: Room = await this.service.findById(roomId);

    const resultValidations: boolean = this.makeBasicVerificationsToJoinOnRoom({ roomToJoin, playerName });
    if (!resultValidations) return;

    const player: Player = new Player({
      role: RoleType.PLAYER,
      name: playerName,
    });

    roomToJoin.players.push(player);

    this.service.upsert(roomToJoin) // TO DO criar um método insertUser na service ao invés de chamar esse upsert
      .then(() => {
        this.toastView.showSuccessMessage('Sucesso!', 'Sala entrada com sucesso! =)');
        this.redirectToGameRoom(roomId);
        localStorage.setItem('player-id', player.id);
        localStorage.setItem('last-room', roomId);
      })
      .catch(() => this.toastView.showErrorMessage('Erro ao entrar na sala!', 'Ocorreu um erro desconhecidom contate um de nossos administradores! =)'));
  }

  private makeBasicVerificationsToJoinOnRoom (basicData: any): boolean {
    let result: boolean = true;
    const { roomToJoin, playerName } = basicData;

    if (!roomToJoin) {
      this.toastView.showErrorMessage('Sala não encontrada!', 'Verifique o nome da sala e tente novamente! =)');
      result = false;
    };

    const indexPlayerWithSameName: number = roomToJoin.players.findIndex(player => player.name.toLocaleLowerCase().trim() === playerName.toLocaleLowerCase().trim());
    if (indexPlayerWithSameName !== -1) {
      this.toastView.showinfoMessage('Nome já existente!', 'Já existe um jogador com esse nome na sala, tente novamente com outro nome!');
      result = false;
    };

    return result;
  }

  private validate (playerName: string, roomName: string): boolean {
    const isValidPlayer = this.validatePlayer(playerName);
    const isValidRoom = this.validateRoom(roomName);
    return isValidPlayer && isValidRoom;
  }

  private validatePlayer (playerName: string): boolean {
    if (!playerName) {
      this.view.showPlayerError('O nome é obrigatório.');
      return false;
    }
    if (playerName.length < 3) {
      this.view.showPlayerError('O nome deve conter no minímo 3 caracteres.');
      return false;
    }
    this.view.clearPlayerError();
    return true;
  }

  private validateRoom (roomName: string): boolean {
    if (!roomName) {
      this.view.showRoomError('A sala é obrigatória.');
      return false;
    }
    if (roomName.length < 3) {
      this.view.showRoomError('A sala deve conter no minímo 3 caracteres.');
      return false;
    }
    this.view.clearRoomError();
    return true;
  }
}
