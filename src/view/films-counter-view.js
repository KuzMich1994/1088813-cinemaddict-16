import ComponentView from './component-view';

const createFilmsCounterTemplate = (getAllFilms) => (
  `<p>${getAllFilms.length} movies inside</p>`
);

export default class FilmsCounterView extends ComponentView {
  #counter = null;
  constructor(counter) {
    super();
    this.#counter = counter;
  }

  get template() {
    return createFilmsCounterTemplate(this.#counter);
  }
}
