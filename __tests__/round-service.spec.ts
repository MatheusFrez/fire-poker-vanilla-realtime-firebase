import Player from '../src/models/player';
import { RoleType } from '../src/models/role-type';
import Room from '../src/models/room';
import Round from '../src/models/round';
import UserStory from '../src/models/user-story';
import Vote from '../src/models/vote';
import RoomSingletonService from '../src/services/room-service';
import RoundService from '../src/services/round-service';

describe('Round updates tests', () => {
  const roomService: RoomSingletonService = RoomSingletonService.getInstance();
  const room: Room = new Room({
    title: 'test-room-1',
    finished: false,
    players: [],
    round: new Round({
      timeRemaining: null,
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

  it('Should update time remaining', async () => {
    const timeRemaining = 60;
    await roundService.updateTimeRemaining(60);
    const roomRound = await RoomSingletonService.getInstance().findById(room.id);
    expect(roomRound.round.timeRemaining).toBe(timeRemaining);
  });

  it('Should update time attempts', async () => {
    const attempts = 2;
    await roundService.updateAttempts(attempts);
    const roomRound = await RoomSingletonService.getInstance().findById(room.id);
    expect(roomRound.round.attempts).toBe(attempts);
  });

  it('Should update round', async () => {
    const timeRemaining = 120;
    const userStory = new UserStory({
      name: 'Teste',
      description: 'Testando',
    });
    const round = new Round({
      votes: [],
      userStory,
      timeRemaining,
    });
    await roundService.update(round);
    const roomRound = await RoomSingletonService.getInstance().findById(room.id);
    expect(roomRound.round.userStory?.name).toBe(userStory.name);
    expect(roomRound.round.timeRemaining).toBe(timeRemaining);
  });
});

describe('Round listeners tests', () => {
  const roomService: RoomSingletonService = RoomSingletonService.getInstance();
  const room: Room = new Room({
    title: 'test-room-2',
    finished: false,
    players: [],
    round: new Round({
      timeRemaining: null,
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

  it('Should listen for votes.', async (done) => {
    roundService.listenForVotes().subscribe((votes) => {
      expect(votes).toHaveLength(1);
      done();
    });
    await roundService.inserVote(new Vote({
      player: new Player({
        name: 'Teste',
        role: RoleType.ADMIN,
      }),
      cards: [],
    }));
  });

  it('Should listen for start round.', async (done) => {
    roundService.listenForStarted().subscribe((started) => {
      expect(started).toBeTruthy();
      done();
    });
    room.round.started = true;
    await roundService.update(room.round);
  });

  it('Should listen for finish round.', async (done) => {
    roundService.listenForFinished().subscribe((finished) => {
      expect(finished).toBeTruthy();
      done();
    });
    room.round.finished = true;
    await roundService.update(room.round);
  });

  it('Should listen for timer.', async (done) => {
    const timeRemaining = 60;
    roundService.listenForTimer().subscribe((timer) => {
      expect(timer).toBe(timeRemaining);
      done();
    });
    room.round.timeRemaining = timeRemaining;
    await roundService.update(room.round);
  });
});
