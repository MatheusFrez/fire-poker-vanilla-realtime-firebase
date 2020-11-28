import View from './view';

export default class HomeView extends View {
  protected template (): string {
    return `
    <div id="home">
      <div class="container">
        <div class="col s12 m5 container">
            <div class="card-panel lighten-1 z-depth-4">
              <div class="row" id="card-title">
                <div class="col s12">
                  <h4 class="center-align">Fire Poker</h4>
                </div>
              </div>
              <div class="input-field col s6">
                <input id="player_name" type="text">
                <label for="player_name">Seu nome</label>
                <span id="player_name_error" class="helper-text"></span>
              </div>
              <div class="input-field col s6" id="input-room-name">
                <input id="room_name" type="text" class="active">
                <label for="room_name">Sala</label>
                <span id="room_name_error" class="helper-text"></span>
              </div>
              <div id="btns-action-1" class="btn-actions">
                <button class="waves-effect waves-light btn" id="btn-create"><i class="material-icons left">add</i>Criar</button>
                <button class="waves-effect waves-light btn" id="btn-join"><i class="material-icons left">meeting_room</i>Entrar</button>
              </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  public onCreateRoom (callback: any): void {
    document.getElementById('btn-create')
      .addEventListener('click', callback);
  }

  public onJoinRoom (callback: any): void {
    document.getElementById('btn-join')
      .addEventListener('click', callback);
  }

  public showPlayerError (error: string): void {
    this.playerErrorElement.innerText = error;
    this.playerInput.classList.add('invalid');
  }

  public clearPlayerError (): void {
    this.playerErrorElement.innerText = '';
    this.playerInput.classList.remove('invalid');
  }

  public showRoomError (error: string): void {
    this.roomErrorElement.innerText = error;
    this.roomInput.classList.add('invalid');
  }

  public clearRoomError (): void {
    this.roomErrorElement.innerText = '';
    this.roomInput.classList.remove('invalid');
  }

  public get playerName (): string {
    return this.playerInput.value.trim();
  }

  public get roomName (): string {
    return this.roomInput.value.trim();
  }

  private get playerInput (): HTMLInputElement {
    return document.getElementById('player_name') as HTMLInputElement;
  }

  private get roomInput (): HTMLInputElement {
    return document.getElementById('room_name') as HTMLInputElement;
  }

  private get playerErrorElement (): HTMLElement {
    return document.getElementById('player_name_error');
  }

  private get roomErrorElement (): HTMLElement {
    return document.getElementById('room_name_error');
  }
}
