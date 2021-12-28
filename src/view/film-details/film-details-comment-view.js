import dayjs from 'dayjs';
import ComponentView from '../component-view';

const createCommentTemplate = (comment) => {
  const { author, date, emotion, commentMessage } = comment;
  const fullDate = dayjs(date).format('YYYY/MM/D H:mm');

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${commentMessage}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${fullDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class FilmDetailsCommentView extends ComponentView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }
}
