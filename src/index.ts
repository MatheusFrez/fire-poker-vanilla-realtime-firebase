import './register-service-worker';

// EXAMPLE LISTENING A ROOM
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

roomService.listenCollection('dsasdasaddsa').subscribe(
  (room: Room) => {
    console.log('SALA ALTERADA NO FIRABAS QUE ESTOU OUVINDO ALTERAÇÕES', room);
  },
);

// END EXAMPLE
