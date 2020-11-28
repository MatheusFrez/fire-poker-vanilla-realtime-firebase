import Card from './card';

export default class Deck {
  public name: string;
  public cards: Array<Card>;

  constructor (params: {
    name: string;
    cards: Array<Card>,
  }) {
    this.name = params.name;
    this.cards = params.cards;
  }
}
