import Room from '../models/room';
import { fireDb } from '../plugins/firebase';
import { Observable } from 'rxjs';

export default class RoomFiredbSingletonService {
  private static instance: RoomFiredbSingletonService;
  public collection: string = 'room'
  private constructor () {}

  public static getInstance () {
    if (!this.instance) this.instance = new RoomFiredbSingletonService();
    return this.instance;
  }

  public async findById (id: string): Promise<Room> {
    return fireDb.collection(this.collection).doc(id).get()
      .then(res => new Room(res as any)); // TO DO REVER ESSE as any
  }

  public async remove (id: string): Promise<void> {
    return fireDb.collection(this.collection)
      .doc(id)
      .delete();
  }

  public async upsert (room: Room): Promise<Room> {
    return fireDb.collection(this.collection)
      .doc(room.id)
      .set(room, { merge: true })
      .then(() => room);
  }

  public listenCollection (id: string): Observable<Room> {
    try {
      return Observable.create(
        (observer) => {
          fireDb.collection(this.collection)
            .onSnapshot(querySnapshot => {
              querySnapshot.forEach((docChanged) => {
                const doc = docChanged.data();
                if (doc.id === id) {
                  observer.next(doc);
                }
              });
            });
        },
      );
    } catch (e) {
    }
  }
}
