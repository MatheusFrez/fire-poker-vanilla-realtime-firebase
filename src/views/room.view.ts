import View from './view';
import { Dropdown, Modal } from 'materialize-css';
import { mixedDeck } from '../common/decks';
import Card from '../models/card';
import { cardDeck, cardUserHistory } from '../components/card';
import Player from '../models/player';
import UserStory from '../models/user-story';
export default class RoomView extends View {
  protected template (id: string): string {
    return `
    <div id="room">
      <div class="wrapper d-none">
      <div class="row">
        <div class="col l3 s12 d-none">
          <div class="player-container">
            <div id="timer-count-wrapper">
            <h5 id="time-remaining"></h5>
            <span class="material-icons">
            timer
            </span>
            </div>
                  <table>
                      <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Status</th>
                        </tr>
                      </thead>
                      <tbody id="tbody">

                      </tbody>
                    </table>
              </div>
          </div>
          <div class="col l5 s12" style="position: relative;">
              <ul class="card-stacks" id="card-stacks">
                  <li class="stack stack-1 stack-center">
                    <ul class="cards-down">

                    </ul>
                  </li>
                  <li class="stack stack-2 stack-center">
                  <ul class="cards-down">

                  </ul>
                  </li>
                  <li class="stack stack-3 stack-center">
                    <ul class="cards-down">

                    </ul>
                  </li>
                  <li class="stack stack-4 stack-center">
                    <ul class="cards-down">

                    </ul>
                  </li>
                  <h3 id="counter-vote"></h3>
              </ul>
              <div class="button-wrapper">
                <button class="waves-effect waves-light btn" id="btn-confirm-play">CONFIRMAR JOGADA</button>
              </div>
          </div>
          <div class="col l4 s12 d-none">
            <section class="cards-history-container" id="histories-wrapper">
            </section>
          </div>
      </div>
    </div>
    <div class="wrapper-mobile">
      <button class='dropdown-trigger btn' id="fab" data-target='dropdown1'>
        <span class="material-icons">
          list
        </span>
      </button>

      <ul id='dropdown1' class='dropdown-content'>
          <li id="btn-menu-players"><b><span class="material-icons">account_circle</span>Jogadores</b></li>
          <li class="divider" tabindex="-1"></li>
          <li id="btn-menu-histories"><a><span class="material-icons">note</span>História</a></li>
      </ul>

      <div class="cards-container-wrapper">

      </div>

      <div class="button-wrapper-mobile">
          <h3 id="counter-vote-mobile">0</h3>
          <button class="waves-effect waves-light btn" id="btn-confirm-play-mobile">CONFIRMAR JOGADA</button>
          <h2 id="time-remaining"></h2>
      </div>
    </div>

    <div id="modal" class="modal">
    <div class="modal-content">
      <h4>Detalhes</h4>
      <div id="template-modal">

      </div>
    </div>
    <div class="modal-footer">
      <button class="modal-close waves-effect waves-green btn-flat">Fechar</a>
    </div>
  </div>
  </div>

    `;
  };

  protected setup (): void {
    Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {});
    Modal.init(document.querySelectorAll('.modal'), {});
    document.getElementById('card-stacks').style.pointerEvents = 'none';
  }

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
          element.querySelector(`.card-${anotherIndex} .card`).classList.toggle('check');
          document.getElementById('counter-vote').innerHTML = onDone().toString();
        });
      });
    });
  }

  public onClickConfirmPlay (onClick: Function): void {
    document.getElementById('btn-confirm-play').addEventListener('click', () => {
      onClick();
    });
  }

  public updateTimeReamining (time: string) {
    document.querySelector('#time-remaining').textContent = time;
  }

  public generateCardsDeckMobile (onClick: Function, onCheck: Function, onDone: Function): void {
    const div = document.querySelector('.wrapper-mobile .cards-container-wrapper');
    mixedDeck.cards.forEach((card: Card, index: number) => {
      div.insertAdjacentHTML('afterbegin', cardDeck(card, index));
      div.querySelector('.card').addEventListener('click', (event: any) => {
        if (!onCheck) {
          return;
        }
        onClick(card);
        document.getElementById(`${index}`).classList.toggle('check');
        document.getElementById('counter-vote-mobile').innerHTML = onDone().toString();
      });
    });
  }

  public async generateCardsUserHistory (histories: UserStory[]): Promise<void> {
    const section = document.getElementById('histories-wrapper');
    histories.forEach((history: UserStory, index: number) => {
      section.insertAdjacentHTML('afterbegin', cardUserHistory(history, index));
    });
  }

  public async listPlayers (players: Player[]): Promise<void> {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    players.forEach((player) => {
      tbody.insertAdjacentHTML('afterbegin', `
      <tr>
        <td>
        ${player.name}
        ${player.role === 'admin' ? '<span id="admin-icon"  data-position="top" data-tooltip="Administrador" class="material-icons tooltipped">how_to_reg</span>' : ''}
        </td>
        <td>Lollipop</td>
      </tr>
      `);
    });
  }

  public onClickShowPlayersModal (players: Player[]): void {
    document.getElementById('btn-menu-players').addEventListener('click', () => {
      this.showModalPlayer(players);
    });
  }

  public onClickShowHistoriesModal (histories: UserStory[]): void {
    document.getElementById('btn-menu-histories').addEventListener('click', () => {
      this.showModalHistories(histories);
    });
  }

  public showModalPlayer (players: Player[]): void {
    const instance = Modal.getInstance(document.getElementById('modal'));
    document.getElementById('template-modal').innerHTML = `
    <div class="player-container">
    <table>
        <thead>
          <tr>
              <th>Nome</th>
              <th>Status</th>
          </tr>
        </thead>
        <tbody id="tbody">
          ${players.map((value, index) => `<tr>
          <td>
          ${value.name}
          ${value.role === 'admin' ? '<span id="admin-icon"  data-position="top" data-tooltip="Administrador" class="material-icons tooltipped">how_to_reg</span>' : ''}
          </td>
          <td>Lollipop</td>
        </tr>`).join('')}
        </tbody>
      </table>
</div>
    `;
    instance.open();
  }

  public showModalHistories (histories: UserStory[]): void {
    const instance = Modal.getInstance(document.getElementById('modal'));
    document.getElementById('template-modal').innerHTML = cardUserHistory(histories[0], 0);
    instance.open();
  }

  public openCardsDeck (): void {
    document.querySelectorAll('.stack').forEach((element:Element) => {
      element.classList.remove('stack-center');
    });
    document.getElementById('card-stacks').classList.toggle('transition');
    document.getElementById('card-stacks').style.pointerEvents = 'all';
  };

  public closeCardsDeck (): void {
    document.getElementById('card-stacks').classList.toggle('transition');
    document.querySelectorAll('.stack').forEach((element) => {
      element.classList.add('stack-center');
      document.getElementById('card-stacks').style.pointerEvents = 'none';
    });
  }

  public generateBackdropAdmin (onClick: Function): void {
    document.getElementById('room').insertAdjacentHTML('afterbegin', `
      <div id="backdrop">
        <button class="modal-close waves-effect waves-green btn" id="btn-begin">Começar jogo</a>
      </div>
    `);
    document.getElementById('btn-begin').addEventListener('click', () => {
      onClick();
      document.getElementById('backdrop').style.display = 'none';
    });
  }
}
