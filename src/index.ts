import './register-service-worker';
import RoomFiredbSingletonService from './services/room-firedb-service';
import Room from './models/room';

const roomService: RoomFiredbSingletonService = RoomFiredbSingletonService.getInstance();

roomService.upsert({
  finished: false,
  identifier: 'dasiudashuadsk CHANGED 3',
  players: [],
  title: 'teste',
  userStories: [],
  id: 'dsasdasaddsa',
});

roomService.listenCollection().subscribe(
  (room: Room) => {
    // console.log('SALA QUE CHEGOU QUE FOI ALTERADA', room);
  },
);
