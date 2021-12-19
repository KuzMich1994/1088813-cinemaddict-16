import ComponentView from '../component-view';

const createTopContainer = () => ('<div class="film-details__top-container"></div>');

export default class FilmDetailsTopContainerView extends ComponentView {
  constructor() {
    super();
  }

  get template() {
    return createTopContainer();
  }
}
