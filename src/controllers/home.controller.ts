import HomeView from '../views/home.view';
import Controller from './controller';
import router from '../router/index';
import { Toast } from 'materialize-css';

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
    const playerName = (document.getElementById('player_name') as HTMLInputElement).value;
    const roomName = (document.getElementById('room_name') as HTMLInputElement).value;

    if (!playerName || playerName.length < 3 || !roomName || roomName.length < 3) {
      new Toast({ html: 'Campos inválidos', displayLength: 500 });
      return;
    }
    router.push(`/room/register/histories?name=${playerName}&room=${roomName}`);
  }
}
