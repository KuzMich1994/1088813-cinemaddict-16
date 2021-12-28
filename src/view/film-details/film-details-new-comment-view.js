import SmartView from '../smart-view';
import {smiles} from '../../mock/data';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';


const createNewCommentTemplate = (data) => (
  `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
            ${data.isSelected ? `<img src="./images/emoji/${data.emotion}.png" width="30" height="30" alt="emoji-${data.emotion}">` : ''}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${data.commentMessage}</textarea>
        </label>

        <div class="film-details__emoji-list">
          ${smiles.map((smile) => (
    `<input
             class="film-details__emoji-item visually-hidden"
             name="comment-emoji"
             type="radio"
             id="emoji-${smile}"
             value="${smile}">
              <label class="film-details__emoji-label" for="emoji-${smile}">
                <img src="./images/emoji/${smile}.png" width="30" height="30" alt="emoji">
              </label>`
  )).join('')}
        </div>
      </div>`
);

export default class FilmDetailsNewCommentView extends SmartView {
  #commentTextarea = null;
  #newComment = {};

  constructor() {
    super();
    this.#newComment = {
      id: nanoid(),
      author: 'test',
      emotion: null,
      commentMessage: '',
      date: dayjs(),
    };
    this._data = FilmDetailsNewCommentView.parseCommentToData(this.#newComment);
    this.setFormSubmitHandler(this.#commentSubmit);
    this.#setInnerHandlers();
  }

  get template() {
    return createNewCommentTemplate(this._data);
  }

  get data() {
    return this._data;
  }

  restoreHandlers = () => {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.#setInnerHandlers();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.#commentTextarea = this.element.querySelector('.film-details__comment-input');
    this.#commentTextarea.addEventListener('keydown', this.#formSubmitHandler);
  }

  #formSubmitHandler = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (!this._data.emotion || this._data.commentMessage === '') {
        return;
      }

      e.preventDefault();
      this._callback.formSubmit(FilmDetailsNewCommentView.parseDataToComment(this._data));
    }
  }

  #smileChangeHandler = (e) => {
    if (this._data.emotion === e.target.value) {
      return;
    }


    this.updateData({
      emotion: e.target.value,
    });

  }

  #commentTextareaHandler = (e) => {
    this.updateData({
      commentMessage: e.target.value,
    }, true);
  }

  #setInnerHandlers = () => {
    this.#commentTextarea.addEventListener('input', this.#commentTextareaHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#smileChangeHandler);
  }

  #commentSubmit = () => {
    this.#commentTextarea.disabled = true;
  }

  static parseCommentToData = (comment) => ({
    ...comment,
    isSelected: comment.emotion !== null,
  })

  static parseDataToComment = (data) => {
    const comment = {...data};

    delete comment.isSelected;

    return comment;
  }
}
