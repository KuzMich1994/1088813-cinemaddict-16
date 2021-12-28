import ComponentView from './component-view';
import {render, RenderPosition} from '../utils/render';


export default class SmartView extends ComponentView {
  _data = {};

  updateData = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    render(parent, newElement, RenderPosition.BEFOREEND);

    this.restoreHandlers();
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
