import Vote from '../models/vote';

export type AgruppedEstimate = {
  estimate: number,
  amount: number
}

export type Estimate = {
  estimate: number
}
export default class EstimateSingletonService {
  private static instance: EstimateSingletonService;

  private constructor () {}

  public static getInstance () {
    if (!this.instance) this.instance = new EstimateSingletonService();
    return this.instance;
  }

  public calculateEstimate (attempt:number, votes: Vote[]): number {
    let storyPointsDistanceLimit = 5;
    const totalEstimates: Estimate[] = this.formatArrTotalEstimate(votes);

    if (attempt === 3) {
      const amountPerEstimates = totalEstimates.reduce((acc, value) => {
        const index = acc.findIndex((perEstimate: AgruppedEstimate) => perEstimate.estimate === value.estimate);
        index >= 0 ? acc[index].amount++ : acc.push({ estimate: value.estimate, amount: 1 });
        return acc;
      }, [] as AgruppedEstimate[]);

      const mostVoted = amountPerEstimates.filter((value) => value.amount === this.getMaxValueProperty(amountPerEstimates, 'amount'));

      if (mostVoted.length === 1) {
        return (mostVoted.pop()).estimate;
      } else {
        return (mostVoted.find(value => value.estimate === this.getMaxValueProperty(mostVoted, 'estimate'))).estimate;
      }
    }

    if (attempt === 2) {
      storyPointsDistanceLimit = 25;
    }

    if (this.isNearVotes(totalEstimates, storyPointsDistanceLimit)) {
      const media = Math.ceil(totalEstimates.reduce((acc, value) => acc + value.estimate, 0) / totalEstimates.length);
      return media;

      // const maior = Math.max(...totalEstimates.map(value => value.estimate));
      // return maior;
    }
    return 0;
  }

  private isNearVotes (array: any[], limite: number): boolean {
    return !array.some((value) => Math.abs(array[0].estimate - value.estimate) >= limite);
  }

  private getMaxValueProperty (array: AgruppedEstimate[], property: string): number {
    return Math.max(...array.map(value => value[property]));
  }

  private formatArrTotalEstimate (array: Vote[]): Estimate[] {
    return array.map((value) => {
      return {
        estimate: value.cards.reduce((acc, value) => value.value ? acc + value.value : 0, 0),
      };
    }).filter(value => value.estimate);
  }

  // public async leaveRoom (): Promise<void> {
  //   const idPlayer = localStorage.getItem(this.PLAYER_ITEM);
  //   const roomId = localStorage.getItem(this.ROOM_ITEM);
  //   const room = await this.service.findById(roomId);

  //   room.players.splice(room.players.findIndex((value) => value.id === idPlayer));
  //   this.service.upsert(room);

  //   this.clearStoreGameInfo();
  //   router.push('/');
  // }

  // public clearStoreGameInfo (): void {
  //   localStorage.clear();
  // }
}
