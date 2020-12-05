import Card from '../models/card';

export const PLAYER_ITEM: string = 'player-id';
export const ROOM_ITEM: string = 'last-room';

export const CARD_DEFAULT: Card = new Card({
  symbol: '?',
  description: 'Não tenho ideia',
});
