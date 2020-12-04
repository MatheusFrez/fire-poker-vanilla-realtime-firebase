import EndGameView from '../views/end-game-view';
import RoomSingletonService from '../services/room-service';
import Controller from './controller';
import Room from '../models/room';
//  import router from '../router/index';

export default class EndGameController implements Controller {
  private view: EndGameView;
  private service: RoomSingletonService;
  private roomId: string;
  private room: Room;
  constructor () {
    this.view = new EndGameView();
    this.service = RoomSingletonService.getInstance();
    // this.roomId = window.location.pathname.replace('/room/', '').split('/')[0];
    // console.log("rromid",this.roomId);
    // this.room = await this.service.findById(this.roomId);
  }

  public async init (id: string) :Promise<void> {
    // this.service.findById(id).then((room: Room) => {
    //   if (!room.finished) {
    //     return router.push('/');
    //   } else {
    //     this.view.render();
    //   }
    // });
    this.room = await this.service.findById(id);
    this.view.render();
    this.view.generateCollapsible(this.room.userStories);
  }
}
