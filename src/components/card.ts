import Card from '../models/card';
import UserStory from '../models/user-story';

export function cardDeck (card: Card, index: number): string {
  return `
  <div class='card' id=${index}>
    <h3 class="card__value__center">
      ${card.symbol}
      </h3>
      <div class='card__face card__face--top'>
        <span class='card__value'>
          ${card.symbol}
        </span>
        <span class='card__suit'>
        </span>
      </div>
      <div class='card__face card__face--btm'>
        <span class='card__value'>
          ${card.symbol}
        </span>
        <span class='card__suit'>
        </span>
      </div>
    </div>`;
}

export function cardUserHistory (history: UserStory, index: number): string {
  return `
    <div class="card-history" id=${index}>
      <h4>${history.name}</h4>
      <p>
          ${history.description}
      </p>
    </div>
  `;
}
