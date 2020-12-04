import Chart from 'chart.js';
import Room from '../models/room';

declare type GraphData = {
  card: string
  percent: number
}

declare type CardTotal = {
  card: string
  quantityPlayersUsed: number
}

export default class ChartGeneratorService {
  public renderChart (idCanvas: string, room: Room) {
    const graphDataCards: Array<GraphData> = this.generateGraphData(room);
    const data = {
      datasets: [{
        data: graphDataCards.map(cardResult => cardResult.percent),
      }],
      labels: graphDataCards.map(cardResult => cardResult.card),
    };

    const elemento: HTMLCanvasElement = document.getElementById(idCanvas) as any;
    const ctx = elemento.getContext('2d');
    // eslint-disable-next-line no-unused-vars
    const chart = new Chart(ctx, { // eslint-disable-line no-use-before-define
      type: 'pie',
      data: data,
      borderWidth: 1,
      options: {
        responsive: true,
        backgroundColor: '#fc4903',
        maintainAspectRatio: true,
        title: {
          display: true,
          fontSize: 35,
          fontStyle: 'normal',
          text: 'Resultado jogadas %',
          fontColor: 'black',
        },
        plugins: {
          colorschemes: {
            scheme: 'brewer.OrRd4',
          },
        },
      },
    });
  }

  private generateGraphData (room: Room): Array<GraphData> {
    const cardsTotal: Array<CardTotal> = [];
    const cardsResult: Array<GraphData> = [];
    room.estimatedUserStories.forEach(storie => {
      (storie.votes || []).forEach(vote => {
        vote.cards.forEach(card => {
          const indexCard: number = cardsTotal.findIndex(cardTotal => cardTotal.card === card.symbol);
          if (indexCard === -1) cardsTotal.push({ card: card.symbol, quantityPlayersUsed: 1 });
          else cardsTotal[indexCard].quantityPlayersUsed += 1;
        });
      });
    });

    const quantityTotalUseCard: number = cardsTotal.reduce((total, card) => total + card.quantityPlayersUsed, 0);
    cardsTotal.forEach(totalCard => {
      const percent: number = Number(((totalCard.quantityPlayersUsed / quantityTotalUseCard) * 100).toFixed(2));
      cardsResult.push({
        card: `Carta [ ${totalCard.card} ] `,
        percent: percent,
      });
    });
    return cardsResult;
  }
}
