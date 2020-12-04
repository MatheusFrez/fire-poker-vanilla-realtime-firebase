import HomeController from '../controllers/home.controller';
import RoomController from '../controllers/room.controller';
import HistoryRegisterView from '../controllers/history-register.controller';
import EndGameController from '../controllers/end-game-controller';
import NotFoundView from '../views/not-found.view';
import Router from './router';

const router = new Router({
  routes: [{
    path: /^\/$/,
    callback: (room: string) => {
      new HomeController()
        .init(room);
    },
  }, {
    path: /^\/room\/register\/?/,
    callback: () => {
      new HistoryRegisterView()
        .init();
    },
  }, {
    path: /^\/room\/([0-9-A-z-]+)\/?$/,
    callback: (id) => {
      new RoomController()
        .init(id);
    },
  },
  {
    path: /^\/room\/([0-9-A-z-]+)\/end\/?$/,
    callback: (id) => {
      new EndGameController()
        .init(id);
    },
  }],
  notFound: () => {
    new NotFoundView()
      .render();
  },
});

export default router;
