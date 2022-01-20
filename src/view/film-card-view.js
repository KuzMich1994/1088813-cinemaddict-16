import dayjs from 'dayjs';
import { addElipsis, getTimeFromMins } from '../utils/common';
import ComponentView from './component-view';

const createFilmCardControlsTemplate = (isAlreadyWatched, isFavorite, isWatchList) => (`<div class="film-card__controls">
      <button class="film-card__controls-item ${isWatchList ? 'film-card__controls-item--active' : ''} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${isAlreadyWatched ? 'film-card__controls-item--active' : ''} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${isFavorite ? 'film-card__controls-item--active' : ''} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>`);

export const createFilmCardTemplate = (film) => {
  const { name, release, poster, runtime, genre, description, rating, isAlreadyWatched, isFavorite, isWatchList, comments } = film;
  const year = dayjs(release.date).year();
  const controlsTemplate = createFilmCardControlsTemplate(isAlreadyWatched, isFavorite, isWatchList);

  return (`<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${name ? name : ''}</h3>
      <p class="film-card__rating">${rating ? rating : ''}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year ? year : ''}</span>
        <span class="film-card__duration">${runtime ? getTimeFromMins(runtime) : ''}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster ? poster : ''}" alt="${name ? name : ''}" class="film-card__poster">
      <p class="film-card__description">${addElipsis(description, 140)}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    ${controlsTemplate}
  </article>`);
};

export default class FilmCardView extends ComponentView {
  #film;
  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setOpenPopupClickHandler = (callback) => {
    this._callback.openPopup = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopupHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchListClickHandler);
  }

  #favoriteClickHandler = (e) => {
    e.preventDefault();
    this._callback.favoriteClick();
  }

  #alreadyWatchedClickHandler = (e) => {
    e.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  #watchListClickHandler = (e) => {
    e.preventDefault();
    this._callback.watchlistClick();
  }

  #openPopupHandler = (e) => {
    e.preventDefault();
    this._callback.openPopup();
  }
}
