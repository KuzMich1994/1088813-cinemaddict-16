import ComponentView from '../component-view';

const createFilmDetailsForm = () => (
  `<form class="film-details__inner" action="" method="get">

    </form>`
);

export default class FilmDetailsFormView extends ComponentView {
  constructor() {
    super();
  }

  get template() {
    return createFilmDetailsForm();
  }
}
