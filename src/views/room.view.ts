import View from './view';

export default class RoomView extends View {
  protected template (id: string): string {
    return `
      ROOM ${id}
    `;
  }
}
