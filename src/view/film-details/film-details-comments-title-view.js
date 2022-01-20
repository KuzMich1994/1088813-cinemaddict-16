import ComponentView from '../component-view';

const createCommentsTitle = () => (
  '<h3 class="film-details__comments-title">Comments </h3>'
);

export default class FilmDetailsCommentsTitleView extends ComponentView {

  constructor() {
    super();
  }

  get template() {
    return createCommentsTitle();
  }
}
