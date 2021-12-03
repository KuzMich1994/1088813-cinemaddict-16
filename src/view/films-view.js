import ComponentView from './component-view';

const createFilmsTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmsView extends ComponentView {

  get template() {
    return createFilmsTemplate();
  }

}
