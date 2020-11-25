import HomeView from '../views/home.view';
import Controller from './controller';
import router from '../router/index';

export default class HomeController implements Controller {
  private view: HomeView;

  constructor () {
    this.view = new HomeView();
  }

  public init (): void {
    this.view.render();
    this.view.onCreateRoom(() => this.create());
  }

  private create (): void {
    const playerName = this.view.playerName;
    const roomName = this.view.roomName;
    const isValid = this.validate(playerName, roomName);
    if (isValid) {
      router.push(`/room/register?name=${playerName}&room=${roomName}`);
    }
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
