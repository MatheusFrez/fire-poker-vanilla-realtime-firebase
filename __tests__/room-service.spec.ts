import { mixedDeck } from '../src/common/decks';
import Player from '../src/models/player';
import { RoleType } from '../src/models/role-type';
import Room from '../src/models/room';
import RoomSingletonService from '../src/services/room-service';

describe('Tests about collection of room on database', () => {
  const roomService: RoomSingletonService = RoomSingletonService.getInstance();
  it('Should insert a room on database.', async () => {
    const roomToInsert: Room = new Room({
      finished: false,
      settings: {
        timeout: 200,
        deck: mixedDeck,
      },
      players: [new Player({
        name: 'doidao',
        role: RoleType.ADMIN,
      })],
      title: 'teste',
      pendingUserStories: [],
      id: 'test-room-1',
    });
    await roomService.upsert(roomToInsert);
    const room: Room = await roomService.findById('test-room-1');
    expect(room).toBeDefined();
  });

  it('Should update room on database.', async () => {
    const roomToUpdate: Room = new Room({
      finished: false,
      settings: {
        timeout: 200,
        deck: mixedDeck,
      },
      players: [new Player({
        name: 'doidao',
        role: RoleType.ADMIN,
      })],
      title: 'teste-room-jest-updated',
      pendingUserStories: [],
      id: 'test-room-1',
    });
    await roomService.upsert(roomToUpdate);
    const room: Room = await roomService.findById('test-room-1');
    expect(room.title).toEqual('teste-room-jest-updated');
  });

  it('Should remove a room from database.', async () => {
    await roomService.remove('test-room-1');
    const room: Room = await roomService.findById('test-room-1');
    expect(room).toBeNull();
  });

  it('Should list roomn from database.', async () => {
    const rooms: Array<Room> = await roomService.list();
    expect(rooms.length).toBeGreaterThan(1);
  });
});
