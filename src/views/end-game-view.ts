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
            <div class="col l12 s12 m12" id="headers-buttons">
              <button id="btn-download-json" class="btn-flat"><i class="material-icons left">receipt_long</i>Resultado JSON</button>
              <button id="btn-imprimir-json" class="btn-flat"><i class="material-icons left">print</i>Resultado</button>
            </div>
            <div class="card-panel lighten-1 z-depth-4" id="historias-list">
              <ul class="collapsible expandable" id="collapsible">

              </ul>
              <div>
                <canvas id="result-chart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  protected setup (): void {
    Collapsible.init(document.querySelectorAll('.collapsible'), { accordion: false });
  }

  public onDownloadResults (callback: any): void {
    document.querySelector('#btn-download-json')
      .addEventListener('click', callback);
  }

  public onPrintResults (callback: any): void {
    document.querySelector('#btn-imprimir-json')
      .addEventListener('click', callback);
  }

  public generateCollapsible (userStories: any[]): void {
    const collapseElement = document.getElementById('collapsible');
    collapseElement.innerHTML = '';
    (userStories || []).forEach((userStory, index) => {
      const element = document.createElement('li');
      element.innerHTML = `
      <div class="collapsible-header">
        <span class="order">${index + 1}</span>
        <span class="truncate">${userStory?.name ?? ''}</span>
        <span> Estimativa: ${userStory?.result ?? 0}</span>
      </div>

      <div class="collapsible-body">
        <span>${userStory?.description ?? ''}</span>
        <hr>
      ${userStory.votes.map((vote) => {
        return `
        <div class="row">
          <div class="col l3 s12" id="name-wrapper">
            <span class="material-icons">
            account_circle
            </span>${vote?.player?.name ?? ''}
          </div>
          <div class="col l8 s12" id="card-wrapper">
        ${vote.cards.map((card) => {
          return `
            <div class="mini-card">
              <span>${card?.symbol ?? ''}</span>
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
