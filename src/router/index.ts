import HomeController from '../controllers/home.controller';
import RoomController from '../controllers/room.controller';
import NotFoundView from '../views/not-found.view';
import Router from './router';

const router = new Router({
  routes: [{
    path: /^\/$/,
    callback: () => {
      new HomeController()
        .init();
    },
  }, {
    path: /^\/room\/(\d+)\/?$/,
    callback: (id) => {
      new RoomController()
        .init(id);
    },
  }],
  notFound: () => {
    new NotFoundView()
      .render();
  },
});

export default router;
