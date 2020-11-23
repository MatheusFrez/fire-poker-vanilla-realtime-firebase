import HistoryRegisterView from '../views/history-register.view';
import Controller from './controller';
import { Modal, updateTextFields, Collapsible } from 'materialize-css';
import router from '../router/index';

export interface History {
  id: number,
  name: string,
  description: string,
  order?: number
}

export default class HistoryRegisterController implements Controller {
  private view: HistoryRegisterView;
  private arrHistories: History[];
  private idToEdit: number;
  private playerName: string;
  private roomName: string

  constructor () {
    this.view = new HistoryRegisterView();
    this.arrHistories = [];
    const urlParams = new URLSearchParams(window.location.search);
    this.playerName = urlParams.get('name');
    this.roomName = urlParams.get('room');
    if (!this.playerName || !this.roomName) {
      router.push('/');
      document.location.reload();
    }
  }

  public init (): void {
    this.view.render();
    this.view.onClickAdd();
    this.view.onClickConfirmationModal(this.HandleInsertHistory.bind(this));
    this.view.onClickConfirmation(this.createRoom.bind(this));
  }

  private HandleInsertHistory (id?: number): void {
    const inputNameHistory = (document.getElementById('input_name_history') as HTMLInputElement).value;
    const inputRole = (document.getElementById('input_role') as HTMLInputElement).value;
    const inputFunctionality = (document.getElementById('input_functionality') as HTMLInputElement).value;
    const inputBusinessObjective = (document.getElementById('input_business_objective') as HTMLInputElement).value;

    if (!inputNameHistory || !inputRole || !inputBusinessObjective || !inputFunctionality) {
      return;
    }

    const result = ['Como um ' + inputRole, 'Desejo ' + inputFunctionality, 'Para ' + inputBusinessObjective].join(' ');

    if (this.arrHistories.find(history => history.id == this.idToEdit)) {
      this.updateHistory({
        name: inputNameHistory,
        description: result,
      }, this.idToEdit);
      this.idToEdit = null;
    } else {
      const history = {
        id: this.arrHistories.length,
        name: inputNameHistory,
        description: result,
      };
      this.arrHistories.push(history);
      this.generateCollapsible(history);
    }

    this.clearInputs();
    updateTextFields();
  }

  private clearInputs ():void {
    (document.getElementById('form') as HTMLFormElement).reset();
    document.getElementById('input_functionality').textContent = '';
    document.getElementById('input_business_objective').textContent = '';
  }

  private fillForm (title:string, description: string): void {
    (document.getElementById('input_name_history') as HTMLInputElement).value = title;
    (document.getElementById('input_role') as HTMLInputElement).value = description[0];
    document.getElementById('input_functionality').textContent = description[1];
    document.getElementById('input_business_objective').textContent = description[2];
    updateTextFields();
  }

  private updateHistory ({ name, description }:Partial<History>, id: number): void {
    const history = this.arrHistories.find(hist => hist.id == id);
    const index = this.arrHistories.findIndex(hist => hist.id == id);
    this.arrHistories[index] = Object.assign({}, history, {
      description,
      name,
    });

    const element: Element = document.querySelector(`[collapse-id=c_${id}]`);
    const spans = element.querySelectorAll('span');
    spans[0].textContent = name;
    spans[1].textContent = description;
  }

  private generateCollapsible ({ name, description, id }: History): void {
    const collapseElement = document.getElementById('collapsible');
    collapseElement.insertAdjacentHTML('afterbegin', `
      <li collapse-id=c_${id}>
        <div class="collapsible-header">
          <i class="material-icons">filter_drama</i>
          <span>${name}</span>
          <button id="btn-edit" class="waves-effect waves-circle waves-light btn-floating secondary-content">
            <i class="material-icons">create</i>
          </button>
          <button id="btn-remove" class="waves-effect waves-circle waves-light btn-floating secondary-content">
            <i class="material-icons">close</i>
          </button>
        </div>
        <div class="collapsible-body"><span>${description}</span></div>
      </li>
    `);

    document.getElementById('btn-edit').addEventListener('click', (e: any) => {
      e.stopPropagation();
      const parent = e.currentTarget.parentElement;
      const title = parent.querySelector('span').textContent;
      let description = parent.parentElement.querySelector('.collapsible-body span').textContent;
      description = description.split(/Como um|Desejo|Para/).slice(1);
      this.fillForm(title, description);
      this.idToEdit = id;
      Modal.getInstance(document.getElementById('modal-register')).open();
    });

    document.getElementById('btn-remove').addEventListener('click', (e: any) => {
      e.stopPropagation();
      document.querySelector(`[collapse-id=c_${id}]`).remove();
      this.arrHistories.slice(this.arrHistories.findIndex(elem => elem.id == id), 1);
    });

    Collapsible.init(document.querySelectorAll('.collapsible.expandable'), { accordion: false });
  }

  private createRoom (): void {
    this.arrHistories = this.OrderCollapsablesArr();
    // Criar sala aqui
  }

  private OrderCollapsablesArr (): any {
    return Array.from(document.querySelectorAll('.collapsible li'))
      .map((element: Element, index: number) => {
        const id = element.getAttribute('collapse-id').split('_')[1];
        return {
          ...this.arrHistories.find(elem => elem.id == Number(id)),
          order: index,
        };
      });
  }
}
