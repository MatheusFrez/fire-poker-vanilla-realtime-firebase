import View from './view';

export default class NotFoundView extends View {
  protected template (): string {
    return `
      <div>
        <h1>Página não encontrada!</h1>
        <a href="/">Página inicial</a>
      </div>
    `;
  }
}
