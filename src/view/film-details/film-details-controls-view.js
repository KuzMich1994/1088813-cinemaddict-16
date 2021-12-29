import ComponentView from '../component-view';

const createControls = (film) => {
  const { isWatchList, isAlreadyWatched, isFavorite } = film;
  return (
    `<section class="film-details__controls">
        <button type="button" class="film-details__control-button ${isWatchList ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${isAlreadyWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${isFavorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>`
  );
};

export default class FilmDetailsControlsView extends ComponentView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createControls(this.#film);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListClickHandler);
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
}
