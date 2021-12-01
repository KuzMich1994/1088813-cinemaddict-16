import { createElement } from '../utils';

const createFilmsListTemplate = (extraClass) => (
  `<section class="films-list ${extraClass ? extraClass : ''}">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`
);

export default class FilmsListView {
  #element;
  #extraClass;
  constructor(extraClass) {
    this.#extraClass = extraClass;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListTemplate(this.#extraClass);
  }

  removeElement() {
    this.#element = null;
  }
}
