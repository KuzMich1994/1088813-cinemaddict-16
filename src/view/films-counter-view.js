import { createElement } from '../utils';

const createFilmsCounterTemplate = (getAllFilms) => (
  `<p>${getAllFilms.length} movies inside</p>`
);

export default class FilmsCounterView {
  #element = null;
  #counter = null;
  constructor(counter) {
    this.#counter = counter;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsCounterTemplate(this.#counter);
  }

  removeElement() {
    this.#element = null;
  }
}
