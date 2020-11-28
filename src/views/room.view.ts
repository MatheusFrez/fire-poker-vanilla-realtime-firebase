import View from './view';
import { Dropdown } from 'materialize-css';
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
      <button class='dropdown-trigger btn'  id="fab"data-target='dropdown1'><span class="material-icons">
          list
          </span>
      </button>

      <ul id='dropdown1' class='dropdown-content'>
          <li><a href="#!"><span class="material-icons">account_circle</span>Jogadores</a></li>
          <li class="divider" tabindex="-1"></li>
          <li><a href="#!"><span class="material-icons">note</span>História</a></li>
        </ul>

      <div class="cards-container-wrapper">

      </div>

      <div class="button-wrapper">
          <button class="waves-effect waves-light btn" id="btn-confirm-play">CONFIRMAR JOGADA</button>
      </div>
  </div>
</div>
    `;
  };

  protected setup (): void {
    Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {});
  }

  public generateCardsDeck (onClick: Function): void {
    document.querySelectorAll('.stack').forEach((element: Element, index: number) => {
      const li = element.getElementsByTagName('ul')[0];
      mixedDeck.cards.slice(index * 4, (index + 1) * 4).forEach((card: Card, anotherIndex: number) => {
        li.insertAdjacentHTML('afterbegin', `<li class="card card-${anotherIndex}"></li>`);
        li.getElementsByTagName('li')[0].insertAdjacentHTML('afterbegin', cardDeck(card, anotherIndex));

        element.querySelector('.card').addEventListener('click', (event: any) => {
          element.querySelector(`.card-${anotherIndex} .card`).classList.toggle('check');
          onClick(card);
        });
      });
    });
  }

  public generateCardsDeckMobile (onClick: Function): void {
    const div = document.querySelector('.wrapper-mobile .cards-container-wrapper');
    mixedDeck.cards.forEach((card: Card, index: number) => {
      div.insertAdjacentHTML('afterbegin', cardDeck(card, index));
      div.querySelector('.card').addEventListener('click', (event: any) => {
        document.getElementById(`${index}`).classList.toggle('check');
        onClick(card);
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
        <td>
        ${player.name}
        ${player.role === 'admin' ? '<span id="admin-icon"  data-position="top" data-tooltip="Administrador" class="material-icons tooltipped">how_to_reg</span>' : ''}
        </td>
        <td>Lollipop</td>
      </tr>
      `);
    });
  }
}
