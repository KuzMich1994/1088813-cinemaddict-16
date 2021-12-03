import ComponentView from './component-view';

const createFilmsListTemplate = (extraClass) => (
  `<section class="films-list ${extraClass ? extraClass : ''}"></section>`
);

export default class FilmsListView extends ComponentView {
  #extraClass;
  constructor(extraClass) {
    super();
    this.#extraClass = extraClass;
  }

  get template() {
    return createFilmsListTemplate(this.#extraClass);
  }
}
