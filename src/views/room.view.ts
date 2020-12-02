import View from './view';
import { Tooltip } from 'materialize-css';
import Card from '../models/card';
import { cardDeck, cardUserHistory } from '../components/card';
import Player from '../models/player';
import UserStory from '../models/user-story';
import timer, { updateTimer } from '../components/timer';
import Deck from '../models/deck';
import loader from '../components/loader';

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
                <div class="button-wrapper"></div>
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

  public generateCardsDeck (deck: Deck, onClick: Function, onCheck: Function): void {
    document.querySelectorAll('.stack').forEach((element: Element, index: number) => {
      const ul = element.querySelector('ul');
      const start = index * 4;
      const end = (index + 1) * 4;
      deck.cards.slice(start, end).forEach((card: Card, anotherIndex: number) => {
        const li = document.createElement('li');
        li.className = `card card-${anotherIndex}`;
        li.innerHTML = cardDeck(card, anotherIndex);
        li.addEventListener('click', () => {
          if (!onCheck(card)) {
            return;
          }
          onClick(card);
          li.classList.toggle('check');
        });
        ul.appendChild(li);
      });
    });
  }

  public updateTimeReamining (time: number, total: number) {
    updateTimer(time, total);
  }

  public async generateCardsUserHistory (histories: UserStory[]): Promise<void> {
    const section = document.getElementById('histories-wrapper');
    histories.forEach((history: UserStory, index: number) => {
      section.insertAdjacentHTML('afterbegin', cardUserHistory(history, index));
    });
  }

  public async listPlayers (players: Player[]): Promise<void> {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = players.map((player) => `
      <tr>
        <td class="truncate tooltipped" data-tooltip="${player.name}${player.isAdmin ? '<br>Coordenador' : ''}">
          <i class="material-icons ${player.isAdmin ? 'teal-text' : ''}">person</i>
          ${player.name}
        </td>
        <td>1</td>
      </tr>
      `,
    ).join('');
    Tooltip.init(document.querySelectorAll('.tooltipped'), {
      exitDelay: 0,
      margin: 0,
      position: 'left',
    });
  }

  public openCardsDeck (): void {
    document.getElementById('card-stacks').classList.add('transition');
  };

  public closeCardsDeck (): void {
    document.getElementById('card-stacks').classList.remove('transition');
  }

  public showInitGame (onClick: any): void {
    const initBtn = document.createElement('button');
    initBtn.className = 'waves-effect waves-light btn-small';
    initBtn.textContent = 'Iniciar Jogo';
    initBtn.addEventListener('click', () => {
      onClick();
    });
    document.querySelector('.button-wrapper').append(initBtn);
  }

  // public generateBackdropAdmin (onClick: Function): void {
  //   document.getElementById('room').insertAdjacentHTML('afterbegin', `
  //     <div id="backdrop">
  //       <button class="modal-close waves-effect waves-green btn" id="btn-begin">Começar jogo</a>
  //     </div>
  //   `);
  //   document.getElementById('btn-begin').addEventListener('click', () => {
  //     onClick();
  //     document.getElementById('backdrop').style.display = 'none';
  //   });
  // }

  public showLoader (message: string): void {
    document.body.insertAdjacentHTML('afterbegin', loader(message));
  }

  public hideLoader (): void {
    document.querySelector('.loading').remove();
  }
}
