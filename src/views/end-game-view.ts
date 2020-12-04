import View from './view';
import { Collapsible } from 'materialize-css';
//  import UserStory from '../models/user-story';

export default class EndGameView extends View {
  protected template (): string {
    return `
    <div id="end-game">
      <div class="container">
        <div class="row">
            <div class="col l12 s12 m12">
              <div class="card-panel lighten-1 z-depth-4">
              <ul class="collapsible expandable" id="collapsible">

              </ul>
              </div>
            </div>
        </div>
      </div>
    </div>
    `;
  }

  protected setup (): void {
    Collapsible.init(document.querySelectorAll('.collapsible'), {});
  }

  public generateCollapsible (userStories: any[]): void {
    //  console.log("userStories",userStories)
    const collapseElement = document.getElementById('collapsible');
    collapseElement.innerHTML = '';
    userStories.forEach((userStory, index) => {
      const element = document.createElement('li');
      element.innerHTML = `
      <div class="collapsible-header">
        <span class="order">${index + 1}</span>
        <span class="truncate">${userStory.name}</span>
        <span> Estimativa: ${userStory.result}</span>
      </div>

      <div class="collapsible-body">
        <span>${userStory.description}</span>
        <hr>
      ${userStory.Votes.map((vote) => {
        return `
        <div class="row">
          <div class="col l3 s12" id="name-wrapper">
            <span class="material-icons">
            account_circle
            </span>${vote.player}
          </div>
          <div class="col l8 s12" id="card-wrapper">
        ${vote.cards.map((card) => {
          return `
            <div class="mini-card">
              <span>${card.symbol}</span>
            </div>`;
        }).join('')}
          </div>
        </div>`;
      }).join('')}
      </div>`;

      collapseElement.appendChild(element);
    });
  }
}
