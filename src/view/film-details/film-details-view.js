
import ComponentView from '../component-view';

const createFilmDetailsTemplate = () => (
  `<section class="film-details">

    </section>`
);


export default class FilmDetailsView extends ComponentView {

  constructor() {
    super();
  }

  get template() {
    return createFilmDetailsTemplate();
  }
}
