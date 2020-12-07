import Room from '../models/room';
import { fireDb } from '../plugins/firebase';
import { Observable } from 'rxjs';
import toSimpleJson from '../common/simple-json';
import Round from '../models/round';
import Vote from '../models/vote';

export default class RoomSingletonService {
  private static instance: RoomSingletonService;

  public collection: string = 'room';

  private constructor () {}

  public static getInstance () {
    if (!this.instance) this.instance = new RoomSingletonService();
    return this.instance;
  }

  public async findById (id: string): Promise<Room> {
    const response = await fireDb.ref(`${this.collection}/${id}`).get();
    const value = response.val();
    if (!value) {
      return null;
    }
    return new Room({
      ...value,
      round: this.getRound(value.round),
    });
  }

  public async list (): Promise<Array<Room>> {
    return fireDb.ref(`${this.collection}`).get()
      .then(res => {
        const array: Array<Room> = [];
        res.forEach(dado => {
          array.push(new Room(dado.val()));
        });
        return array;
      });
  }

  public async remove (id: string): Promise<void> {
    return fireDb.ref(`${this.collection}/${id}`)
      .remove();
  }

  public async upsert (room: Room): Promise<Room> {
    return fireDb.ref(`${this.collection}/${room.id}`)
      .set(toSimpleJson(room));
  }

  public async updateTimeRemaining (room: Room): Promise<void> {
    return fireDb.ref(`${this.collection}/${room.id}/round/timeRemaining`)
      .set(room.round.timeRemaining);
  }

  public listenCollection (id: string, field: string): Observable<any> {
    try {
      return new Observable(
        (observer) => {
          fireDb.ref(`${this.collection}/${id}/`)
            .child(field)
            .on('value', (snap) => {
              observer.next(snap.val());
            });
        },
      );
    } catch (e) {
    }
  }

  private getRound (round: any): Round {
    if (!round) {
      return null;
    }
    const votes: Vote[] = [];
    for (const key in round.votes) {
      votes.push(new Vote(round.votes[key]));
    }
    return new Round({
      ...round,
      votes,
    });
  }
}
