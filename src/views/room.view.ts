import View from './view';
import { Tooltip } from 'materialize-css';
import Card from '../models/card';
import { cardDeck, cardUserHistory } from '../components/card';
import Player from '../models/player';
import UserStory from '../models/user-story';
import timer, { updateTimer } from '../components/timer';
import Deck from '../models/deck';
import loader from '../components/loader';
import playerItem from '../components/player';
import Round from '../models/round';
import ChartGeneratorService from '../services/chart-generator-service';
import Room from '../models/room';

export default class RoomView extends View {
  protected template (): string {
    return `
      <div id="room">
        <div class="wrapper">
          <div class="d-flex" id="dados-jogada">
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
              </ul>
            </div>
            <div class="col" id="result-container">

            </div>
            <div class="col">
              <div class="player-container">
                <div class="player-header">
                  <h6>Jogadores:</h6>
                  ${timer()}
                </div>
                <table>
                  <tbody id="current-player"></tbody>
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

  public generateCardsDeck (deck: Deck, onCheck: Function): void {
    document.querySelectorAll('.stack').forEach((element: Element, index: number) => {
      const ul = element.querySelector('ul');
      const start = index * 4;
      const end = (index + 1) * 4;
      deck.cards.slice(start, end).forEach((card: Card, anotherIndex: number) => {
        const li = document.createElement('li');
        li.className = `card card-${anotherIndex}`;
        li.innerHTML = cardDeck(card);
        li.addEventListener('click', () => {
          if (!onCheck(card)) {
            return;
          }
          li.classList.toggle('check');
        });
        ul.appendChild(li);
      });
    });
  }

  public updateTimeRemaining (time: number, total: number) {
    updateTimer(time, total);
  }

  public async generateCardsUserHistory (histories: UserStory[]): Promise<void> {
    const section = document.getElementById('histories-wrapper');
    section.innerHTML = histories.map(
      (history: UserStory, index: number) => cardUserHistory(history, index),
    ).join('');
  }

  public async showCurrentPlayer (player: Player): Promise<void> {
    const wrapper = document.getElementById('current-player');
    wrapper.innerHTML = playerItem(player, true);
  }

  public async listPlayers (players: Player[]): Promise<void> {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = players.map((player) => playerItem(player)).join('');
    Tooltip.init(document.querySelectorAll('.tooltipped'), {
      exitDelay: 0,
      margin: 0,
      position: 'left',
    });
  }

  public openCardsDeck (): void {
    document.getElementById('card-stacks').classList.add('transition');
  }

  public hideCurrentUserStory (): void {
    document.querySelector('.card-history').classList.add('hidden');
  }

  public hideCurrentResultStorie (): void {
    document.querySelector('#result-container').classList.remove('visible');
    document.querySelector('#result-container').classList.add('hidden');
  }

  public showCurrentResultStorie (): void {
    document.querySelector('#result-container').classList.add('visible');
  }

  public removeResultAndGraph () {
    const resultContainer = document.getElementById('result-container');
    resultContainer.remove();
  }

  public showStorieResultAndGraph (room: Room): void {
    const chartGenerator = new ChartGeneratorService();
    this.generateCardRound(room.round);
    chartGenerator.renderChart('result-chart-round', room, 'Resultado jogada %', 20);
  }

  public generateCardRound (round: Round): void {
    const cardsNotEspecial: Array<Card> = round.votes.map(vote => vote.cards.filter(card => !card.isSpecial).map(card => card))[0];
    const quantityCardsNotEspecial: number = cardsNotEspecial.length;
    const totalValueCardsNotEspecial: number = cardsNotEspecial.reduce((total, card) => total + card.value, 0);
    const averageCardsEspecialValue: number = Math.round(totalValueCardsNotEspecial / quantityCardsNotEspecial);

    const cardElement = document.getElementById('result-container');

    cardElement.innerHTML = `
        <div id="card-storie">
          <div class="custom-card">
            <div class="flex center">
              <span class="card-title"><i><b>${round?.userStory?.name ?? ''}</b></i></span>
              <span class="card-title" style="margin-left: 10px;"><b>Estimativa:</b> ${round?.userStory?.result ?? 0}</span>
            </div>
            <div class="center" id="limited-text">
              <span class="card-title" style="margin-left: 10px;"><b>Média de cartas:</b> ${averageCardsEspecialValue}</span><br>
              <span><i>${round?.userStory?.description ?? ''}</i></span>
              <hr>
              ${round?.votes.map((vote) => {
              return `
              <div class="row">
                <div class="col l4 s12" id="name-wrapper">
                  <span class="material-icons">
                  account_circle
                  </span>${vote?.player?.name ?? ''}
                </div>
                <div class="col l7 s12" id="card-wrapper">
                ${vote.cards.map((card) => {
                return `
                  <div class="mini-card">
                    <span>${card?.symbol ?? ''}</span>
                  </div>`;
              }).join('')}
              </div>`;
              }).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <canvas id="result-chart-round"></canvas>
        </div>
   `;
    this.showCurrentResultStorie();
  }

  public closeCardsDeck (): void {
    document.getElementById('card-stacks').classList.remove('transition');
    this.clearCheckedsCards();
  }

  public showBtnInWrapper (text: string, id: string, onClick: any): void {
    const initBtn = document.createElement('button');
    initBtn.id = id;
    initBtn.className = 'waves-effect waves-light btn-small';
    initBtn.textContent = text;
    initBtn.addEventListener('click', () => {
      onClick();
    });
    this.btnWrapper.innerHTML = '';
    this.btnWrapper.append(initBtn);
  }

  public showInitGame (onClick: any): void {
    this.showBtnInWrapper('Iniciar', 'init', onClick);
  }

  public showConfirm (onClick: any): void {
    this.showBtnInWrapper('Confirmar', 'confirm', onClick);
  }

  public hideConfirm (): void {
    document.getElementById('confirm')?.remove();
  }

  public showNext (onClick: any): void {
    this.showBtnInWrapper('Próxima história', 'next', onClick);
  }

  public showFinish (onClick: any): void {
    this.showBtnInWrapper('Terminar', 'finish', onClick);
  }

  public showLoader (message: string): void {
    document.body.insertAdjacentHTML('afterbegin', loader(message));
  }

  public hideLoader (): void {
    document.querySelector('.loading').remove();
  }

  private clearCheckedsCards (): void {
    document.querySelectorAll('.check').forEach((element) => {
      element.classList.remove('check');
    });
  }

  private get btnWrapper (): HTMLButtonElement {
    return document.querySelector('.button-wrapper');
  }
}
