import { Observable } from 'rxjs';
import toSimpleJson from '../common/simple-json';

import Room from '../models/room';
import Round from '../models/round';
import Vote from '../models/vote';
import { fireDb } from '../plugins/firebase';

export default class RoundService {
  private room: Room;

  constructor (room: Room) {
    this.room = room;
  }

  public async inserVote (vote: Vote): Promise<void> {
    await fireDb.ref(`${this.path}/votes`)
      .push(toSimpleJson(vote));
  }

  public async updateAttempts (attempt: number): Promise<void> {
    await fireDb.ref(`${this.path}/attempts`)
      .set(attempt);
  }

  public async updateTimeRemaining (timeRemaining: number): Promise<void> {
    return fireDb.ref(`${this.path}/timeRemaining`)
      .set(timeRemaining);
  }

  public async update (round: Round): Promise<void> {
    return fireDb.ref(this.path)
      .set(round);
  }

  public listenForVotes (): Observable<Vote[]> {
    return new Observable(
      (observer) => {
        fireDb.ref(`${this.path}/votes`)
          .on('value', (snap) => {
            const object = snap.val();
            const votes = [];
            for (const key in object) {
              votes.push(new Vote(object[key]));
            }
            if (votes.length) {
              observer.next(votes);
            }
          });
      },
    );
  }

  public listenForStarted (): Observable<boolean> {
    return new Observable(
      (observer) => {
        fireDb.ref(`${this.path}/started`)
          .on('value', (snap) => {
            const value: boolean = snap.val();
            if (value) {
              observer.next(value);
            }
          });
      },
    );
  }

  public listenForFinished (): Observable<boolean> {
    return new Observable(
      (observer) => {
        fireDb.ref(`${this.path}/finished`)
          .on('value', (snap) => {
            const value: boolean = snap.val();
            if (value) {
              observer.next(value);
            }
          });
      },
    );
  }

  public listenForTimer (): Observable<number> {
    return new Observable(
      (observer) => {
        fireDb.ref(`${this.path}/timeRemaining`)
          .on('value', (snap) => {
            const value: number = snap.val();
            if (value !== null) {
              observer.next(value);
            }
          });
      },
    );
  }

  private get path (): string {
    return `room/${this.room.id}/round`;
  }
}
