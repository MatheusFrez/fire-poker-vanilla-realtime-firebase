import './register-service-worker';

// EXAMPLE LISTENING A ROOM
import RoomSingletonService from './services/room-service';
import Room from './models/room';

const roomService: RoomSingletonService = RoomSingletonService.getInstance();

roomService.upsert({
  finished: false,
  identifier: 'dasiudashuadsk CHANGED 3',
  players: [{
    name: 'doidao',
    role: 'dasdasdas',
  }],
  title: 'teste',
  userStories: [],
  id: 'dsasdasaddsa',
});

roomService.listenCollection('dsasdasaddsa', 'finished').subscribe(
  (room: Room) => {
    console.log('DADO ALTERADO NA SALA DESSE SUBJECT', room);
  },
);

// END EXAMPLE
