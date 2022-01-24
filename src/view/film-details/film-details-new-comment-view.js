import SmartView from '../smart-view';
import {SMILES} from '../../const';
import dayjs from 'dayjs';
import he from 'he';

const createEmojiTemplate = (emotions, commentEmotion, isDisabled) => emotions.map((emotion) => {
  const isChecked = (emotion === commentEmotion) ? 'checked' : '';

  return `<input
             class="film-details__emoji-item visually-hidden"
             name="comment-emoji"
             type="radio"
             id="emoji-${emotion}"
             ${isChecked}
             ${isDisabled ? 'disabled' : ''}
             value="${emotion}">
              <label class="film-details__emoji-label" for="emoji-${emotion}" >
                <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji" data-emotion="${emotion}">
              </label>`;
}).join('');

const createNewCommentTemplate = (data) => (
  `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
            ${data.activeEmotion ? `<img src="./images/emoji/${data.activeEmotion}.png" width="30" height="30" alt="emoji-${data.activeEmotion}">` : ''}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" ${data.isDisabled ? 'disabled' : ''} name="comment">${data.commentMessage ? data.commentMessage : ''}</textarea>
        </label>

        <div class="film-details__emoji-list">
            ${createEmojiTemplate(SMILES, data.activeEmotion, data.isDisabled)}
        </div>
      </div>`
);


export default class FilmDetailsNewCommentView extends SmartView {

  constructor(comments) {
    super();

    this._data = FilmDetailsNewCommentView.parseCommentToData(comments);
    this.#setInnerHandlers();
  }

  get template() {
    return createNewCommentTemplate(this._data);
  }

  restoreHandlers = () => {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.#setInnerHandlers();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#formSubmitHandler);
  }

  #formSubmitHandler = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (!this._data.activeEmotion || this._data.commentMessage === '') {
        return;
      }

      e.preventDefault();
      this._data.newComment = {
        emotion: this._data.activeEmotion,
        commentMessage: this._data.commentMessage,
        date: dayjs(),
      };
      this._callback.formSubmit(FilmDetailsNewCommentView.parseDataToComment(this._data));
      this.updateElement();
    }
  }

  #commentTextareaHandler = (e) => {
    this.updateData({
      commentMessage: he.encode(e.target.value),
    }, true);

  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-label img').forEach((item) => {
      item.addEventListener('click', this.#emotionClickHandler);
    });
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentTextareaHandler);
  }

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      activeEmotion: evt.target.dataset.emotion,
    });
  }

  static parseCommentToData = (comments) => ({
    comments: [...comments],
    activeEmotion: null,
    commentMessage: '',
    newComment: null,
    isDisabled: false,
  })

  static parseDataToComment = (data) => {
    const comment = data.newComment;

    delete data.activeEmotion;
    delete data.commentMessage;
    delete data.isDisabled;

    return comment;
  }
}
