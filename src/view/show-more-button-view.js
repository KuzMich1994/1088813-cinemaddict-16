import ComponentView from './component-view';

const createShowMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreView extends ComponentView {
  get template() {
    return createShowMoreButtonTemplate();
  }

  setAddCardsClickHandler = (callback) => {
    this._callback.addCards = callback;
    this.element.addEventListener('click', this.#addCardsClickHandler);
  }

  #addCardsClickHandler = (e) => {
    e.preventDefault();
    this._callback.addCards();
  };
}
