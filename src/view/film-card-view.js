import dayjs from 'dayjs';
import { addElipsis, getRandomInteger, getTimeFromMins, createElement } from '../utils';

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
        <span class="film-card__genre">${genre[getRandomInteger(0, genre.length - 1)]}</span>
      </p>
      <img src="./images/posters/${poster ? poster : ''}" alt="${name ? name : ''}" class="film-card__poster">
      <p class="film-card__description">${addElipsis(description, 140)}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    ${controlsTemplate}
  </article>`);
};

export default class FilmCardView {
  #element;
  #film;
  constructor(film) {
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}
