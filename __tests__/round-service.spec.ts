import Player from '../src/models/player';
import { RoleType } from '../src/models/role-type';
import Room from '../src/models/room';
import Round from '../src/models/round';
import Vote from '../src/models/vote';
import RoomSingletonService from '../src/services/room-service';
import RoundService from '../src/services/round-service';

describe('Round tests', () => {
  const roomService: RoomSingletonService = RoomSingletonService.getInstance();
  const timeRemaining = 60;
  const room: Room = new Room({
    title: 'test-room',
    finished: false,
    players: [],
    round: new Round({
      timeRemaining,
      userStory: null,
      votes: [],
    }),
    pendingUserStories: [],
  });
  const roundService = new RoundService(room);

  beforeAll(() => {
    return roomService.upsert(room);
  });

  afterAll(() => {
    return roomService.remove(room.id);
  });

  it('Should insert a vote in round.', async () => {
    await roundService.inserVote(new Vote({
      player: new Player({
        name: 'Teste',
        role: RoleType.ADMIN,
      }),
      cards: [],
    }));
    const roomInBase: Room = await roomService.findById(room.id);
    expect(roomInBase.round.votes).toHaveLength(1);
  });

  it('Should listen for votes.', async (done) => {
    roundService.listenForVotes().subscribe((votes) => {
      expect(votes).toHaveLength(1);
      done();
    });
  });

  it('Should listen for start round.', async (done) => {
    roundService.listenForStarted().subscribe((started) => {
      expect(started).toBeTruthy();
      done();
    });
    room.round.started = true;
    await roomService.upsert(room);
  });

  it('Should listen for finish round.', async (done) => {
    roundService.listenForStarted().subscribe((finished) => {
      expect(finished).toBeTruthy();
      done();
    });
    room.round.finished = true;
    await roomService.upsert(room);
  });

  it('Should listen for timer.', async (done) => {
    roundService.listenForTimer().subscribe((timer) => {
      expect(timer).toBe(timeRemaining);
      done();
    });
  });
});
