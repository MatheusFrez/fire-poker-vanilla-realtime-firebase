import View from './view';
import { updateTextFields } from 'materialize-css';
export default class HomeView extends View {
  protected template (): string {
    return `
    <div id="home">
      <div class="container">
        <div class="col s12 m5 container">
            <div class="card-panel teal lighten-1">
              <div class="row" id="card-title">
                <div class="col s4 d-none">
                    <img src='assets/img/logo-512x512.png' width="50" alt="">
                </div>
                <div class="col s12">
                    <h4 class="center-align">Fire Poker</h4>
                </div>
              </div>
              <div class="input-field col s6">
                  <input id="player_name" type="text" class="validate active">
                  <label for="player_name">Digite seu nome</label>
              </div>
              <div class="input-field col s6" id="input-room-name">
                <input id="room_name" type="text" class="validate active">
                <label for="room_name">Digite o nome da sala</label>
              </div>
              <div id="btns-action-1">
                <button class="waves-effect waves-light btn" id="btn-create"><i class="material-icons left" >add</i>Criar sala</button>
                <button class="waves-effect waves-light btn" id="btn-join"><i class="material-icons left">meeting_room</i>Entrar em uma sala</button>
              </div>
              <div id="btns-action-2" class="d-none">
                <button class="waves-effect waves-light btn" id="btn-cancel"><i class="material-icons left" >close</i>Cancelar</button>
                <button class="waves-effect waves-light btn" id="btn-create"><i class="material-icons left">check</i>Confirmar</button>
              </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  protected setup (): void {
    updateTextFields();
  }

  public onCreateRoom (callback: any): void {
    document.getElementById('btn-create')
      .addEventListener('click', callback);
  }
}
