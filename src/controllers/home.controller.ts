import HomeView from '../views/home.view';
import Controller from './controller';

export default class HomeController implements Controller {
  private view: HomeView;

  constructor () {
    this.view = new HomeView();
  }

  public init (): void {
    this.view.render();
  }
}
