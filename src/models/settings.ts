import { mixedDeck } from '../common/decks';
import Deck from './deck';

export default class Settings {
  public id?: string;
  public timeout: number;
  public deck: Deck;

  constructor (params?: {
    id?: string,
    timeout?: number,
    deck?: Deck,
  }) {
    this.id = params?.id;
    this.timeout = params?.timeout || 60;
    this.deck = params?.deck || mixedDeck;
  }
}
