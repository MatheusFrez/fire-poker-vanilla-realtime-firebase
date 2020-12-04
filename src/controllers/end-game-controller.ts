import EndGameView from '../views/end-game-view';
import RoomSingletonService from '../services/room-service';
import Controller from './controller';
import Room from '../models/room';
import { saveAs } from 'file-saver';
import { Collapsible } from 'materialize-css';
import 'chartjs-plugin-colorschemes';
import ChartGeneratorService from '../services/chart-generator-service';

export default class EndGameController implements Controller {
  private view: EndGameView;
  private service: RoomSingletonService;
  private room: Room;
  private graphGeneratorService: ChartGeneratorService;
  constructor () {
    this.view = new EndGameView();
    this.service = RoomSingletonService.getInstance();
    this.graphGeneratorService = new ChartGeneratorService();
    setTimeout(() => {
      this.view.onDownloadResults(() => this.downloadResults());
      this.view.onPrintResults(() => this.printResults());
    }, 2000);
  }

  public async init (id: string) :Promise<void> {
    this.room = await this.service.findById(id);
    this.view.render();
    this.view.generateCollapsible(this?.room?.estimatedUserStories ?? []);
    this.renderChart();
  }

  private renderChart () {
    this.graphGeneratorService.renderChart('result-chart', this.room);
  }

  private printResults () {
    const element = document.querySelector('#collapsible');
    this.room.estimatedUserStories.forEach((value, index) => {
      const instance = Collapsible.getInstance(element);
      instance.open(index);
    });
    setTimeout(() => window.print(), 500);
  }

  private downloadResults () {
    const results = this.room.estimatedUserStories.map(story => {
      return {
        description: story.description,
        result: story.result,
        votes: story.votes,
        name: story.name,
      };
    });
    const blob = new Blob([JSON.stringify(results)], { type: 'application/json' });
    saveAs(blob, `result-${this.room.title}.json`);
  }
}
