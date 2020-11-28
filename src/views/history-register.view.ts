import { Collapsible, Modal, updateTextFields } from 'materialize-css';
import Sortable from 'sortablejs';

import View from './view';
import UserStory from '../models/user-story';
import loader from '../components/loader';

export default class HistoryRegisterView extends View {
  private userStoryToEdit: UserStory;

  protected template () :string {
    return `
    <div id="history-register">
      <div class="container">
        <div class="card-panel lighten-1 z-depth-4">
          <div class="row">
            <h4 class="col">Histórias de Usuário</h4>
            <div class="col">
              <button class="btn-floating waves-effect waves-light center-align" id="btn-add">
                <i class="material-icons">add</i>
              </button>
            </div>
          </div>
          <ul class="collapsible expandable popout" id="collapsible"></ul>
          <div class="btn-actions text-right" id="btn-confirmation-div">
            <a href="/" class="waves-effect waves-light btn-small">
              <i class="material-icons left">close</i>Cancelar
            </a>
            <button id="btn-confirmation" class="waves-effect waves-light btn-small" id="btn-create">
              <i class="material-icons left">check</i>Confirmar
            </button>
          </div>
        </div>
      </div>
      <!-- Modal Structure -->
      <div id="modal-register" class="modal">
        <div class="modal-content">
          <form class="col s12" id="form">
            <div class="row">
              <div class="input-field col s12">
                <input id="input_name" type="text">
                <label for="input_name">Nome da História </label>
                <span id="name_error" class="helper-text"></span>
              </div>
              <div class="input-field col s12">
                <textarea placeholder="Como um <papel>\nDesejo <funcionalidade>\nPara <objetivo de negócio>\n" id="input_description" class="materialize-textarea"></textarea>
                <label for="input_description" class="active">Descrição</label>
                <span id="description_error" class="helper-text"></span>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button id="btn-cancel-modal" class="waves-effect waves-teal btn-flat">Cancelar</button>
          <button id="btn-confirmation-modal" class="waves-effect waves-teal btn-flat">Confirmar</button>
        </div>
      </div>
    </div>
    `;
  }

  protected setup (): void {
    Modal.init(document.querySelectorAll('.modal'), {
      dismissible: false,
    });
    Collapsible.init(document.querySelectorAll('.collapsible.expandable'));
    this.onClickAdd();
    this.onCancelForm();
    this.preventFormDefault();
  }

  public onOrderChange (callback: any): void {
    Sortable.create(document.getElementById('collapsible'), {
      animation: 150,
      fallbackTolerance: 3,
      onSort: (ev) => {
        callback(ev.oldIndex, ev.newIndex);
      },
    });
  }

  public onPutStory (callback: any): void {
    document.getElementById('btn-confirmation-modal')
      .addEventListener('click', () => callback(this.userStoryToEdit));
  }

  public onConfirme (callback: any) :void {
    document.getElementById('btn-confirmation')
      .addEventListener('click', callback);
  }

  public listUserStories (
    userStories: UserStory[],
    onDelete: any,
  ): void {
    const collapseElement = document.getElementById('collapsible');
    if (!userStories.length) {
      collapseElement.innerHTML = `
        <div class="grey-text center empty">Clique em <i class="material-icons">add</i> para adicionar suas histórias de usuário.</div>
      `;
      return;
    }
    collapseElement.innerHTML = '';
    userStories.forEach((userStory, index) => {
      const element = document.createElement('li');
      element.innerHTML = `
        <div class="collapsible-header">
          <span class="order">${index + 1}</span>
          <span class="truncate">${userStory.name}</span>
          <button class="btn-edit btn-flat secondary-content">
            <i class="material-icons">create</i>
          </button>
          <button class="btn-remove btn-flat secondary-content">
            <i class="material-icons">close</i>
          </button>
        </div>
        <div class="collapsible-body">
          <pre>${userStory.description}</pre>
        </div>
      `;
      element.querySelector('.btn-edit').addEventListener('click', (event: any) => {
        event.stopPropagation();
        this.userStoryToEdit = userStory;
        this.nameInput.value = userStory.name;
        this.descriptionInput.value = userStory.description;
        this.modal.open();
        updateTextFields();
      });
      element.querySelector('.btn-remove').addEventListener('click', (event: any) => {
        event.stopPropagation();
        onDelete(userStory);
      });
      collapseElement.appendChild(element);
    });
  }

  public showLoader (message: string): void {
    document.body.insertAdjacentHTML('afterbegin', loader(message));
  }

  public hideLoader (): void {
    document.querySelector('.loading').remove();
  }

  public closeForm (): void {
    this.modal.close();
    this.userStoryToEdit = null;
    this.resetForm();
  }

  private resetForm (): void {
    this.form.reset();
    updateTextFields();
  }

  public showNameError (error: string): void {
    this.nameErrorElement.innerText = error;
    this.nameInput.classList.add('invalid');
  }

  public clearNameError (): void {
    this.nameErrorElement.innerText = '';
    this.nameInput.classList.remove('invalid');
  }

  public showDescriptionError (error: string): void {
    this.descriptionErrorElement.innerText = error;
    this.descriptionInput.classList.add('invalid');
  }

  public clearDescriptionError (): void {
    this.descriptionErrorElement.innerText = '';
    this.descriptionInput.classList.remove('invalid');
  }

  private onClickAdd (): void {
    document.getElementById('btn-add')
      .addEventListener('click', () => {
        this.modal.open();
      });
  }

  private onCancelForm (): void {
    document.getElementById('btn-cancel-modal')
      .addEventListener('click', () => {
        this.closeForm();
      });
  }

  private preventFormDefault (): void {
    this.form.addEventListener('submit', (event: any) => {
      event.preventDefault();
    });
  }

  public get name (): string {
    return this.nameInput.value.trim();
  }

  public get description (): string {
    return this.descriptionInput.value.trim();
  }

  private get nameInput (): HTMLInputElement {
    return document.getElementById('input_name') as HTMLInputElement;
  }

  private get nameErrorElement (): HTMLElement {
    return document.getElementById('name_error');
  }

  private get descriptionInput (): HTMLInputElement {
    return document.getElementById('input_description') as HTMLInputElement;
  }

  private get descriptionErrorElement (): HTMLInputElement {
    return document.getElementById('description_error') as HTMLInputElement;
  }

  private get modal (): Modal {
    return Modal.getInstance(document.getElementById('modal-register'));
  }

  private get form (): HTMLFormElement {
    return document.getElementById('form') as HTMLFormElement;
  }
}
