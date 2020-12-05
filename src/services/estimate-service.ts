import Room from '../models/room';
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

  public calculateEstimate (room: Room): number {
    let storyPointsDistanceLimit = 5;
    const totalEstimates: Estimate[] = this.formatArrTotalEstimate(room.round.votes);

    if (room.round.attempts === 3) {
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

    if (room.round.attempts === 2) {
      storyPointsDistanceLimit = 25;
    }

    if (this.isNearVotes(totalEstimates, storyPointsDistanceLimit)) {
      if (room.settings.estimateType === 'average') {
        return Math.ceil(totalEstimates.reduce((acc, value) => acc + value.estimate, 0) / totalEstimates.length);
      } else {
        return this.getMaxValueProperty(totalEstimates as AgruppedEstimate[], 'estimate');
      };
    }
    return 0;
  }

  private isNearVotes (array: Estimate[], limite: number): boolean {
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
}
