import HistoryRegisterView from '../views/history-register.view';
import Controller from './controller';
import router from '../router/index';
import UserStory from '../models/user-story';
import RoomSingletonService from '../services/room-service';
import Room from '../models/room';
import Player from '../models/player';
import { RoleType } from '../models/role-type';
import toast from '../common/toast';
import { PLAYER_ITEM, ROOM_ITEM } from '../common/constants';

import getDeckByName from '../common/decks';
import Settings, { EstimateType } from '../models/settings';
export default class HistoryRegisterController implements Controller {
  private view: HistoryRegisterView;
  private userStories: UserStory[];
  private playerName: string;
  private roomName: string
  private settings: Settings;

  constructor () {
    this.view = new HistoryRegisterView();
    this.userStories = [];
    const urlParams = new URLSearchParams(window.location.search);
    this.playerName = urlParams.get('name');
    this.roomName = urlParams.get('room');
    if (!this.playerName || !this.roomName) {
      router.push('/');
    }
  }

  public init (): void {
    this.view.render();
    this.view.onPutStory(this.putUserStory.bind(this));
    this.view.onConfirme(this.handleCreateRoom.bind(this));
    this.view.onOrderChange(this.onOrderChange.bind(this));
    this.view.onSavePreferences(this.savePreferences.bind(this));
    this.listUserStories();
  }

  private onOrderChange (oldIndex: number, newIndex: number): void {
    const userStory = this.userStories[oldIndex];
    this.userStories.splice(oldIndex, 1);
    this.userStories.splice(newIndex, 0, userStory);
    this.listUserStories();
  }

  private listUserStories (): void {
    this.view.listUserStories(
      this.userStories,
      this.removeUserStory.bind(this),
    );
  }

  private putUserStory (userStory?: UserStory): void {
    const name = this.view.name;
    const description = this.view.description;
    const isValid = this.validate(name, description);
    if (!isValid) {
      return;
    }
    const index = this.findIndex(userStory);
    const newUserStory = new UserStory({
      name,
      description,
    });
    if (index >= 0) {
      this.userStories.splice(index, 1, newUserStory);
    } else {
      this.userStories.push(newUserStory);
    }
    this.listUserStories();
    this.view.closeForm();
  }

  private removeUserStory (userStory: UserStory): void {
    const index: number = this.findIndex(userStory);
    if (index >= 0) {
      this.userStories.splice(index, 1);
      this.listUserStories();
    }
  }

  private findIndex (userStory: UserStory): number {
    return this.userStories.findIndex(
      (value) => value === userStory,
    );
  }

  private validate (
    userStoryName: string,
    description: string,
  ): boolean {
    const isValidStoryName = this.validateUserStoryName(userStoryName);
    const isValidStoryDescription = this.validateUserStoryDescription(description);
    return isValidStoryName && isValidStoryDescription;
  }

  private validateUserStoryName (userStoryName: string): boolean {
    if (!userStoryName) {
      this.view.showNameError('O nome é obrigatório.');
      return false;
    }
    if (userStoryName.length < 3) {
      this.view.showNameError('O nome deve conter no minímo 3 caracteres.');
      return false;
    }
    this.view.clearNameError();
    return true;
  }

  private validateUserStoryDescription (description: string): boolean {
    if (!description) {
      this.view.showDescriptionError('A descrição é obrigatória.');
      return false;
    }
    if (description.length < 10) {
      this.view.showDescriptionError('A descrição deve conter no minímo 10 caracteres.');
      return false;
    }
    this.view.clearDescriptionError();
    return true;
  }

  private storeGameInfo (playerId: string, roomId: string): void {
    localStorage.setItem(PLAYER_ITEM, playerId);
    localStorage.setItem(ROOM_ITEM, roomId);
  }

  private async handleCreateRoom (): Promise<void> {
    if (!this.userStories.length) {
      toast('Adicione as histórias de usuário!');
      return;
    }
    const admin = new Player({
      name: this.playerName,
      role: RoleType.ADMIN,
    });
    const room = new Room({
      title: this.roomName,
      finished: false,
      pendingUserStories: this.userStories,
      players: [admin],
      settings: this.settings,
    });
    this.view.showLoader('Criando sala...');
    const roomService = RoomSingletonService.getInstance();
    await roomService.upsert(room);
    this.view.hideLoader();
    this.storeGameInfo(admin.id, room.id);
    router.push(`/room/${room.id}`);
  }

  private savePreferences (): void {
    this.settings = new Settings({
      deck: getDeckByName(this.view.deckRadioValue),
      timeout: Number(this.view.timeOutInput.value),
      estimateType: this.view.estimateTypeValue as EstimateType,
    });
  }
}
