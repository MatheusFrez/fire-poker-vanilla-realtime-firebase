import { mixedDeck } from '../common/decks';
import Deck from './deck';

export default class Settings {
  public id?: string;
  public timeout: number;
  public deck: Deck;
  public estimateType?: string

  constructor (params?: {
    id?: string,
    timeout?: number,
    deck?: Deck,
    estimateType?: string
  }) {
    this.id = params?.id;
    this.timeout = params?.timeout || 60;
    this.deck = params?.deck || mixedDeck;
    this.estimateType = params?.estimateType || 'higher';
  }
}
