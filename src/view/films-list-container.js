import ComponentView from './component-view';

const createFilmsListContainerTemplate = () => (
  '<div class="films-list__container"></div>'
);

export default class FilmsListContainerView extends ComponentView {

  get template() {
    return createFilmsListContainerTemplate();
  }

}
