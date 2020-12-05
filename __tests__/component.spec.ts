import { cardDeck } from '../src/components/card';
import Card from '../src/models/card';
describe('Tests about component rendering', () => {
  const card = new Card({
    symbol: '☕',
    description: 'Pausa',
    isSpecial: true,
  });

  it('Should create a component', () => {
    document.body.innerHTML = cardDeck(card);
    expect(document.querySelector('.card__value__center').textContent.trim()).toBe(card.symbol);
  });
});
