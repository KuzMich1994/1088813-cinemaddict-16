import ComponentView from './component-view';

const createFilmsListTitle = () => (
  '<h2 class="films-list__title">Loading...</h2>'
);

export default class LoadingView extends ComponentView {

  constructor() {
    super();
  }

  get template() {
    return createFilmsListTitle();
  }
}
