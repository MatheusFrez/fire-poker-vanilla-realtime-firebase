import View from './view';
import { Collapsible, Tooltip } from 'materialize-css';
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
import Vote from '../models/vote';

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
            <div class="col hidden" id="result-container"></div>
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
                <ul class="collapsible">
                <li>
                <div class="collapsible-header"><h6>Convite um colega</h6><i class="material-icons" id="arrow-collapsible">keyboard_arrow_down</i></div>
                  <div class="collapsible-body">
                    <div class="row">
                      <div class="col s10">
                        <input type="text" id="input-link" readonly>
                      </div>
                      <div class="col s2">
                        <span class="material-icons" id="btn-copy" title="Copiar">
                          content_copy
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
                <div class="center-align">
                  <a class="waves-effect waves-light red-text" id="btn-leave">Sair</a>
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

  protected setup (): void {
    Collapsible.init(document.querySelectorAll('.collapsible'));
    this.initializeLink();
  }

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
    this.clearTooltips();
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

  public removeResultAndGraph () {
    this.resultElement.classList.add('hidden');
    this.resultElement.innerHTML = '';
    this.showCardsDeck();
  }

  public showStorieResultAndGraph (room: Room): void {
    this.hideCardsDeck();
    const chartGenerator = new ChartGeneratorService();
    this.generateCardRound(room.round);
    chartGenerator.renderChart('result-chart-round', room, 'Resultado jogada %', 20);
  }

  public generateCardRound (round: Round): void {
    const votesNotEspecial: Array<Vote> = round.votes.filter((vote) => vote.cards.findIndex(card => !card.isSpecial) !== -1);
    const totalValue = votesNotEspecial.map(vote => vote)
      .reduce((cards, vote) => {
        cards.push(...vote.cards.filter((card) => !card.isSpecial));
        return cards;
      }, [] as Card[])
      .reduce((total, card) => total + card.value, 0);
    const average = Math.round(totalValue / votesNotEspecial.length) || 0;

    this.resultElement.innerHTML = `
      <div id="card-storie">
        <div class="flex center">
          ${round?.result > 0
            ? `
              <b>Estimativa:</b>
              <span class="card-title" id="estimate-value">${round?.result}</span>
            `
            : '<span class="card-title" id="estimate-value">Não houve concenso</span>'}
          <br>
          <span class="card-title">
            <b>Média dos votos:</b> ${average}
          </span>
        </div>
        <hr>
      </div>
      <div class="row" id="canvas-wrapper">
        <canvas id="result-chart-round"></canvas>
      </div>
   `;
    this.resultElement.classList.remove('hidden');
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

  public showRepeat (onClick: any): void {
    this.showBtnInWrapper('Repetir história', 'repeat', onClick);
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

  public onLeave (callback: any): void {
    document.getElementById('btn-leave')
      .addEventListener('click', callback);
  }

  private initializeLink (): void {
    const input = document.getElementById('input-link') as HTMLInputElement;
    input.value = window.location.href;
    document.getElementById('btn-copy')
      .addEventListener('click', () => {
        input.focus();
        input.select();
        document.execCommand('copy');
      });
  }

  public updateEstimate (estimate: number): void {
    const element = document.getElementById('estimate-value');
    if (estimate <= 0) {
      element.textContent = 'Não houve consenso';
    } else {
      element.textContent = estimate.toString();
    }
  }

  private hideCardsDeck (): void {
    this.cardsWrapper.classList.add('hidden');
  }

  private showCardsDeck (): void {
    this.cardsWrapper.classList.remove('hidden');
  }

  public rotateCardsAndShowCounts (): void {
    document.querySelectorAll('.innercontainer').forEach((element) => {
      element.classList.remove('rotate-card');
      element.classList.add('rotate-card');
    });

    document.querySelectorAll('.hidden-count').forEach((element) => {
      element.classList.remove('hidden-count');
    });
  }

  private clearTooltips (): void {
    document.querySelectorAll('.tooltipped')?.forEach((element) => {
      Tooltip.getInstance(element)?.destroy();
    });
    document.querySelectorAll('.material-tooltip')?.forEach((element) => {
      element.remove();
    });
  }

  private get btnWrapper (): HTMLButtonElement {
    return document.querySelector('.button-wrapper');
  }

  private get resultElement (): HTMLElement {
    return document.getElementById('result-container');
  }

  private get cardsWrapper (): HTMLElement {
    return document.querySelector('.col.cards');
  }
}
