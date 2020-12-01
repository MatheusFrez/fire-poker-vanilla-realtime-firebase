import Room from '../models/room';
import { fireDb } from '../plugins/firebase';
import { Observable } from 'rxjs';
import toSimpleJson from '../common/simple-json';

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
    return new Room(value);
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

  public listenCollection (id: string, field: string): Observable<any> {
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
