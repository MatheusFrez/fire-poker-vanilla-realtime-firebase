import Room from '../src/models/room';
import RoomSingletonService from '../src/services/room-service';

describe('Tests about collection of room on database', () => {
  const roomService: RoomSingletonService = RoomSingletonService.getInstance();
  it('Should insert a room on database.', async () => {
    const roomToInsert: Room = new Room({
      finished: false,
      identifier: 'teste-room-jest',
      settings: {
        timeout: 200,
      },
      players: [{
        name: 'doidao',
        role: 'dasdasdas',
      }],
      title: 'teste',
      userStories: [],
      id: 'test-room-1',
    });
    await roomService.upsert(roomToInsert);
    const room: Room = await roomService.findById('test-room-1');
    expect(room).toBeDefined();
  });

  it('Should update room on database.', async () => {
    const roomToUpdate: Room = new Room({
      finished: false,
      identifier: 'teste-room-jest-updated',
      settings: {
        timeout: 200,
      },
      players: [{
        name: 'doidao',
        role: 'dasdasdas',
      }],
      title: 'teste',
      userStories: [],
      id: 'test-room-1',
    });
    await roomService.upsert(roomToUpdate);
    const room: Room = await roomService.findById('test-room-1');
    expect(room.identifier).toEqual('teste-room-jest-updated');
  });

  it('Should remove a room from database.', async () => {
    await roomService.remove('test-room-1');
    const room: Room = await roomService.findById('test-room-1');
    expect(room.identifier).toBeUndefined();
  });
});
