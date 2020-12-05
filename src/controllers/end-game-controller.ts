import EndGameView from '../views/end-game-view';
import RoomSingletonService from '../services/room-service';
import Controller from './controller';
import Room from '../models/room';
import { saveAs } from 'file-saver';
import 'chartjs-plugin-colorschemes';
import ChartGeneratorService from '../services/chart-generator-service';
import router from '../router';

export default class EndGameController implements Controller {
  private view: EndGameView;
  private service: RoomSingletonService;
  private room: Room;
  private graphGeneratorService: ChartGeneratorService;
  constructor () {
    this.view = new EndGameView();
    this.service = RoomSingletonService.getInstance();
    this.graphGeneratorService = new ChartGeneratorService();
  }

  public async init (id: string) :Promise<void> {
    this.room = await this.service.findById(id);
    if (!this.room?.finished) {
      // TO DO colocar um toast se a sala n existe ou não foi finalizada ainda 2 toasts diferentes
      return router.push('/');
    }
    this.view.render();
    this.view.onDownloadResults(() => this.downloadResults());
    this.view.generateCollapsible(this.room?.estimatedUserStories ?? []);
    if (this.room.estimatedUserStories) {
      this.renderChart();
    }
  }

  private renderChart () {
    this.graphGeneratorService.renderChart('result-chart', this.room, 'Resultado jogadas %', 35, true);
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
