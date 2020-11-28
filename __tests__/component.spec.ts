import { cardDeck } from '../src/components/card';
import Card from '../src/models/card';
describe('Tests about component rendering', () => {
  const card = new Card({
    symbol: '☕',
    description: 'Pausa',
  });

  it('Should create a component', () => {
    document.body.innerHTML = cardDeck(card, 1);
    expect(document.querySelector('.card__value__center').textContent.trim()).toBe(card.symbol);
  });
});
