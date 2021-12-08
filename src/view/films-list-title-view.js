import ComponentView from './component-view';

const createFilmsListTitle = (textContent, hiddenClass) => (
  `<h2 class="films-list__title ${hiddenClass}">${textContent}</h2>`
);

export default class FilmsListTileView extends ComponentView {
  #textContent = null;
  #hiddenClass = null;

  constructor(textContent, hiddenClass) {
    super();
    this.#textContent = textContent;
    this.#hiddenClass = hiddenClass;
  }

  get template() {
    return createFilmsListTitle(this.#textContent, this.#hiddenClass);
  }
}
