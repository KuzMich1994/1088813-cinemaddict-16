import ComponentView from '../component-view';

const createCommentsCounter = (comments) => (
  `<span class="film-details__comments-count">${comments.length}</span>`
);

export default class CommentsCounterView extends ComponentView {
  #comments = null;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createCommentsCounter(this.#comments);
  }
}
