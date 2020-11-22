import View from './view';

export default class HomeView extends View {
  protected template (): string {
    return `
      <a href="/room/123" id="room">Room</a>
    `;
  }
}
