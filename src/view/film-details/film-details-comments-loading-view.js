import ComponentView from '../component-view';

const createCommentsLoading = () => (
  '<h3 class="film-details__comments-title">Loading... </h3>'
);

export default class FilmDetailsCommentsLoadingView extends ComponentView {

  constructor() {
    super();
  }

  get template() {
    return createCommentsLoading();
  }
}
