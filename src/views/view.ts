export default abstract class View {
  public render (args?: any): void {
    const app: Element = document.querySelector('#app');
    app.innerHTML = this.template(args);
    this.setup();
  }

  protected setup (): void { /* Opcional */ }

  protected abstract template(args?: any): string;
}
