import FilmCardView from '../view/film-card-view';
import {remove, render, RenderPosition, replace} from '../utils/render';
import {UpdateType, UserAction} from '../const';

export default class FilmCardPresenter {
  #filmsListContainerComponent = null;
  #filmCardComponent = null;
  #filmDetailsComponent = null;

  #changeData = null;
  #film = null;

  /**
   * @type {function}
   */
  #handleOpenPopup = null;


  constructor({filmsListContainer, changeData, handleOpenPopup}) {
    this.#filmsListContainerComponent = filmsListContainer;
    this.#handleOpenPopup = handleOpenPopup;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setOpenPopupClickHandler(this.#handleOpenPopup(film));
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchListClick);

    if (prevFilmComponent === null) {
      render(this.#filmsListContainerComponent, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmsListContainerComponent.element.contains(prevFilmComponent.element)) {
      replace(this.#filmCardComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmDetailsComponent);
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #handleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isAlreadyWatched: !this.#film.isAlreadyWatched});
  }

  #handleWatchListClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isWatchList: !this.#film.isWatchList});
  }
}
