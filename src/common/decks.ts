import Card from '../models/card';
import Deck from '../models/deck';

export const mixedDeck: Deck = new Deck({
  name: 'Misto',
  cards: [
    new Card({
      symbol: '½',
      description: 'Meia unidade',
    }),
    new Card({
      symbol: '?',
      description: 'Não tenho ideia',
    }),
    new Card({
      symbol: '∞',
      description: 'Muito tempo',
    }),
    new Card({
      symbol: '☕',
      description: 'Pausa',
    }),
    new Card({
      symbol: '0',
      description: 'Já está pronto',
    }),
    new Card({
      symbol: '1',
      value: 1,
    }), new Card({
      symbol: '2',
      value: 2,
    }), new Card({
      symbol: '3',
      value: 3,
    }), new Card({
      symbol: '4',
      value: 4,
    }), new Card({
      symbol: '5',
      value: 5,
    }), new Card({
      symbol: '10',
      value: 10,
    }), new Card({
      symbol: '15',
      value: 15,
    }), new Card({
      symbol: '30',
      value: 30,
    }), new Card({
      symbol: '45',
      value: 45,
    }),
    new Card({
      symbol: '60',
      value: 60,
    }),
  ],
});
