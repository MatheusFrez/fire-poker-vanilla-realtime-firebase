import Card from '../models/card';
import Deck from '../models/deck';

export default function getDeckByName (name: string): Deck {
  return name === 'fibonacci' ? fibonnaciDeck : mixedDeck;
}

const specialCards: Card[] =
  [
    new Card({
      symbol: '½',
      description: 'Meia unidade',
      isSpecial: true,
    }),
    new Card({
      symbol: '?',
      description: 'Não tenho ideia',
      isSpecial: true,
    }),
    new Card({
      symbol: '∞',
      description: 'Muito tempo',
      isSpecial: true,
    }),
    new Card({
      symbol: '☕',
      description: 'Pausa',
      isSpecial: true,
    }),
    new Card({
      symbol: '0',
      description: 'Já está pronto',
      isSpecial: true,
    }),
  ];

export const mixedDeck: Deck = new Deck({
  name: 'Misto',
  cards: [
    ...specialCards,
    new Card({
      symbol: '1',
      value: 1,
      isSpecial: false,
    }), new Card({
      symbol: '2',
      value: 2,
      isSpecial: false,
    }), new Card({
      symbol: '3',
      value: 3,
      isSpecial: false,
    }), new Card({
      symbol: '4',
      value: 4,
      isSpecial: false,
    }), new Card({
      symbol: '5',
      value: 5,
      isSpecial: false,
    }), new Card({
      symbol: '10',
      value: 10,
      isSpecial: false,
    }), new Card({
      symbol: '15',
      value: 15,
      isSpecial: false,
    }), new Card({
      symbol: '30',
      value: 30,
      isSpecial: false,
    }), new Card({
      symbol: '45',
      value: 45,
      isSpecial: false,
    }),
    new Card({
      symbol: '60',
      value: 60,
      isSpecial: false,
    }),
  ],
});

export const fibonnaciDeck: Deck = new Deck({
  name: 'Fibonacci',
  cards: [
    ...specialCards,
    new Card({
      symbol: '1',
      value: 1,
      isSpecial: false,
    }), new Card({
      symbol: '2',
      value: 2,
      isSpecial: false,
    }), new Card({
      symbol: '3',
      value: 3,
      isSpecial: false,
    }), new Card({
      symbol: '5',
      value: 5,
      isSpecial: false,
    }), new Card({
      symbol: '8',
      value: 8,
      isSpecial: false,
    }), new Card({
      symbol: '13',
      value: 13,
      isSpecial: false,
    }), new Card({
      symbol: '21',
      value: 21,
      isSpecial: false,
    }), new Card({
      symbol: '34',
      value: 34,
      isSpecial: false,
    }), new Card({
      symbol: '55',
      value: 55,
      isSpecial: false,
    }),
    new Card({
      symbol: '89',
      value: 89,
      isSpecial: false,
    }),
  ],
});
