import View from './view';
import { Tooltip } from 'materialize-css';
import { mixedDeck } from '../common/decks';
import Card from '../models/card';
import { cardDeck, cardUserHistory } from '../components/card';
import Player from '../models/player';
import UserStory from '../models/user-story';
import timer from '../components/timer';

export default class RoomView extends View {
  protected template (): string {
    return `
      <div id="room">
        <div class="wrapper">
          <div class="d-flex">
            <div class="col cards">
              <ul class="card-stacks" id="card-stacks">
                <li class="stack stack-1">
                  <ul class="cards-down"></ul>
                </li>
                <li class="stack stack-2">
                  <ul class="cards-down"></ul>
                </li>
                <li class="stack stack-3">
                  <ul class="cards-down"></ul>
                </li>
                <li class="stack stack-4">
                  <ul class="cards-down"></ul>
                </li>
                <h3 id="counter-vote"></h3>
              </ul>
            </div>
            <div class="col">
              <div class="player-container">
                <div class="player-header">
                  <h6>Jogadores:</h6>
                  ${timer()}
                </div>
                <table>
                  <tbody id="tbody"></tbody>
                </table>
                <div class="button-wrapper">
                  <button class="waves-effect waves-light btn-small" id="btn-confirm-play">Iniciar Jogo</button>
                </div>
              </div>
              <div class="col">
                <section class="cards-history-container" id="histories-wrapper"></section>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  public generateCardsDeck (onClick: Function, onCheck: Function, onDone: Function): void {
    document.querySelectorAll('.stack').forEach((element: Element, index: number) => {
      const li = element.getElementsByTagName('ul')[0];
      mixedDeck.cards.slice(index * 4, (index + 1) * 4).forEach((card: Card, anotherIndex: number) => {
        li.insertAdjacentHTML('afterbegin', `<li class="card card-${anotherIndex}"></li>`);
        li.getElementsByTagName('li')[0].insertAdjacentHTML('afterbegin', cardDeck(card, anotherIndex));

        element.querySelector('.card').addEventListener('click', (event: any) => {
          if (!onCheck(card)) {
            return;
          }
          onClick(card);
          element.querySelector(`.card-${anotherIndex}`).classList.toggle('check');
          document.getElementById('counter-vote').innerHTML = onDone().toString();
        });
      });
    });
  }

  public generateCardsUserHistory (histories: UserStory[]): void {
    const section = document.getElementById('histories-wrapper');
    histories.forEach((history: UserStory, index: number) => {
      section.insertAdjacentHTML('afterbegin', cardUserHistory(history, index));
    });
  }

  public listPlayers (players: Player[]): void {
    const tbody = document.getElementById('tbody');
    players.forEach((player) => {
      tbody.insertAdjacentHTML('afterbegin', `
      <tr>
        <td class="truncate tooltipped" data-tooltip="${player.name}${player.isAdmin ? '<br>Coordenador' : ''}">
          <i class="material-icons ${player.isAdmin ? 'teal-text' : ''}">person</i>
          ${player.name}
        </td>
        <td>1</td>
      </tr>
      `);
    });
    Tooltip.init(document.querySelectorAll('.tooltipped'), {
      exitDelay: 0,
      margin: 0,
      position: 'left',
    });
  }
}
