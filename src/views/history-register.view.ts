import View from './view';
import { Modal, updateTextFields } from 'materialize-css';

import Sortable from 'sortablejs';

export default class HistoryRegisterView extends View {
  protected template () :string {
    return `
    <div id="history-register">
      <div class="container">
        <ul class="collapsible expandable popout" id="collapsible">
        </ul>
        <div class="row" id="btn-wrapper">
          <div class="col s6">
            <button class="btn-floating btn-large waves-effect waves-light red center-align" id="btn-add"><i class="material-icons">add</i></button>
          </div>
          <div class="col s6" id="btn-confirmation-div">
            <button id="btn-confirmation" class="waves-effect waves-light btn">Confirmar</a>
          </div>
        </div>
      </div>

      <!-- Modal Structure -->
      <div id="modal-register" class="modal">
        <div class="modal-content">
          <form class="col s12" id="form">
            <div class="row">
              <div class="input-field col s12">
                <input placeholder="Nome da História" id="input_name_history" type="text" class="validate">
                <label for="input_name_history">Nome da História </label>
              </div>
              <div class="input-field col s12">
                <input placeholder="Papel" id="input_role" type="text" class="validate">
                <label for="input_role">Como um </label>
              </div>
              <div class="input-field col s12">
                <textarea  placeholder="Funcionalidade" id="input_functionality" class="materialize-textarea"></textarea>
                <label for="input_functionality">Desejo</label>
              </div>
              <div class="input-field col s12">
                <textarea  placeholder="Objetivo do negócio" id="input_business_objective" class="materialize-textarea"></textarea>
                <label for="input_business_objective">Para</label>
              </div>
            </div>
          </form>
            </div>
          <div class="modal-footer">
            <button class="modal-close waves-effect waves-green btn-flat">Cancelar</a>
            <button id="btn-confirmation-modal" class="modal-close waves-effect waves-green btn-flat">Confirmar</button>
          </div>
      </div>
    </div>
    `;
  }

  protected setup (): void {
    Modal.init(document.querySelectorAll('.modal'), {});
    updateTextFields();
    Sortable.create(document.getElementById('collapsible'), {
      fallbackTolerance: 3,
    });
    Modal.getInstance(document.getElementById('modal-register')).open();
  }

  public onClickAdd (): void {
    document.getElementById('btn-add')
      .addEventListener('click', () => {
        Modal.getInstance(document.getElementById('modal-register')).open();
      });
  }

  public onClickConfirmationModal (callback: any): void {
    document.getElementById('btn-confirmation-modal')
      .addEventListener('click', callback);
  }

  public onClickConfirmation (callback: any) :void {
    document.getElementById('btn-confirmation')
      .addEventListener('click', callback);
  }
}
