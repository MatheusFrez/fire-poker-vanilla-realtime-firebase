import { mixedDeck } from '../common/decks';
import Deck from './deck';

export type EstimateType = 'higher' | 'average';
export default class Settings {
  public id?: string;
  public timeout: number;
  public deck: Deck;
  public estimateType?: EstimateType;

  constructor (params?: {
    id?: string,
    timeout?: number,
    deck?: Deck,
    estimateType?: EstimateType
  }) {
    this.id = params?.id;
    this.timeout = params?.timeout || 60;
    this.deck = params?.deck || mixedDeck;
    this.estimateType = params?.estimateType || 'higher';
  }
}
