import Card from '../models/card';
import Player from '../models/player';
import { cardDeck, cardsDeckFlip } from './card';

const getCountVote = (cards: Card[]): number => {
  return cards.reduce((acc, card) => acc + card.value, 0);
};

const playerItem = (player: Player, currentPlayer = false): string => {
  const cards = player.vote || [];
  const count = getCountVote(cards);
  return `
    <tr class="player">
      <td class="truncate tooltipped" data-tooltip="${player.name}${player.isAdmin ? '<br>Coordenador' : ''}">
        <i class="material-icons
          ${currentPlayer
              ? 'teal-text'
              : player.isAdmin
                ? 'grey-text text-darken-3'
                : 'grey-text'}">account_circle</i>
        ${player.name}
      </td>
      <td>
        <div class="player-vote">
          <div class="player-vote__cards">${
            cards.map((card) => currentPlayer ? cardDeck(card) : cardsDeckFlip(card)).join('')
          }</div>
          <span class="grey-text text-darken-2 ${!currentPlayer ? 'hidden-count' : ''}">${count ? `= ${count}` : ''}</span>
        </div>
      </td>
    </tr>
  `;
};

export default playerItem;
