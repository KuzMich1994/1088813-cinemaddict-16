import { createElement } from '../utils/common';

export default class ComponentView {
  #element = null;
  _callback = {};
  constructor() {
    if (new.target === ComponentView) {
      throw new Error('Can\'t instantiate ComponentView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Absctract method not implemented: get template');
  }

  removeElement() {
    this.#element.remove();
    this.#element = null;
  }
}
