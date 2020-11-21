import RoomView from '../views/room.view';
import Controller from './controller';

export default class RoomController implements Controller {
  private view: RoomView;

  constructor () {
    this.view = new RoomView();
  }

  public init (id: string): void {
    this.view.render(id);
  }
}
