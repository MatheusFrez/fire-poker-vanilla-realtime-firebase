import Room from '../models/room';
import { fireDb } from '../plugins/firebase';
import { Observable } from 'rxjs';

export default class RoomSingletonService {
  private static instance: RoomSingletonService;
  public collection: string = 'room'
  private constructor () {}

  public static getInstance () {
    if (!this.instance) this.instance = new RoomSingletonService();
    return this.instance;
  }

  public async findById (id: string): Promise<Room> {
    return fireDb.ref(`${this.collection}/${id}`).get()
      .then(res => new Room(res.val() as any)); // TO DO REVER ESSE as any
  }

  public async remove (id: string): Promise<void> {
    return fireDb.ref(`${this.collection}/${id}`)
      .remove();
  }

  public async upsert (room: Room): Promise<Room> {
    return fireDb.ref(`${this.collection}/${room.id}`)
      .set(room);
  }

  public listenCollection (id: string, field: string): Observable<Room> {
    try {
      return Observable.create(
        (observer) => {
          fireDb.ref(`${this.collection}/${id}/`)
            .child(field)
            .on('value', (snap) => {
              observer.next({ [snap.key]: snap.val() });
            });
        },
      );
    } catch (e) {
    }
  }
}
