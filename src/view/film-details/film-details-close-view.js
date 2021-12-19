import ComponentView from '../component-view';

const createCloseBlock = () => (
  `<div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>`
);

export default class FilmDetailsCloseView extends ComponentView {
  constructor() {
    super();
  }

  get template() {
    return createCloseBlock();
  }

  setClosePopupClickHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  }

  #closePopupClickHandler = (e) => {
    e.preventDefault();
    this._callback.closePopup();
  }
}
