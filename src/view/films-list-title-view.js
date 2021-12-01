import { createElement } from '../utils';

const createFilmsListTitle = (textContent, hiddenClass) => (
  `<h2 class="films-list__title ${hiddenClass}">${textContent}</h2>`
);

export default class FilmsListTileView {
  #element = null;
  #textContent = null;
  #hiddenClass = null;

  constructor(textContent, hiddenClass) {
    this.#textContent = textContent;
    this.#hiddenClass = hiddenClass;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListTitle(this.#textContent, this.#hiddenClass);
  }

  removeElement() {
    this.#element = null;
  }
}
