import Card from './card';
import Player from './player';

export default class Vote {
  public cards: Array<Card>;
  public player: Player;

  constructor (params: {
    cards: Array<Card>,
    player: Player
  }) {
    this.cards = params.cards;
    this.player = params.player;
  }
}
