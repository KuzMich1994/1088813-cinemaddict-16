import dayjs from 'dayjs';
import ComponentView from '../component-view';

const createCommentTemplate = (generateComment, comments) => {
  const newComment = comments.map(() => {
    const { author, date, emotion, commentMessage } = generateComment();
    const fullDate = dayjs(date).format('YYYY/MM/D H:mm');

    return (`
      <li class="film-details__comment">
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
      </li>
    `);
  });

  return newComment.join('');
};

const createBottomContainer = (film, generateComment) => {
  const { comments } = film;
  return (
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${createCommentTemplate(generateComment, comments)}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>`
  );
};

export default class FilmDetailsBottomContainerView extends ComponentView {
  #film = null;
  #generateComment = null;

  constructor(film, generateComment) {
    super();
    this.#film = film;
    this.#generateComment = generateComment;
  }

  get template() {
    return createBottomContainer(this.#film, this.#generateComment);
  }
}
