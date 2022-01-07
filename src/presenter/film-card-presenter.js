import FilmCardView from '../view/film-card-view';
import {remove, render, RenderPosition, replace} from '../utils/render';
import FilmDetailsPresenter from './film-details-presenter';
import {UpdateType, UserAction} from '../const';

export default class FilmCardPresenter {
  #filmsListContainerComponent = null;
  #filmCardComponent = null;
  #filmDetailsComponent = null;

  #changeData = null;
  #state = null;
  #film = null;
  #filmDetailsPresenter = null;
  #filmsModel = null;

  constructor(filmsListContainer, changeData, state, filmsModel) {
    this.#filmsListContainerComponent = filmsListContainer;
    this.#changeData = changeData;
    this.#state = state;
    this.#filmsModel = filmsModel;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setOpenPopupClickHandler(this.#handleOpenPopup);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchListClick);

    if (prevFilmComponent === null) {
      render(this.#filmsListContainerComponent, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }


    if (this.#filmDetailsPresenter !== null) {
      this.#filmDetailsPresenter.handleControlsChange(film);
    }

    if (this.#filmsListContainerComponent.element.contains(prevFilmComponent.element)) {
      replace(this.#filmCardComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  handleFilmDetailsChange = (filmData) => {
    if (this.#filmDetailsPresenter !== null) {
      this.#filmDetailsPresenter.handleControlsChange(filmData);
    }
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmDetailsComponent);
  }

  #escKeyDownHandler = (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc') && this.#state.isOpen) {
      this.#state.isOpen = false;
      document.querySelector('.film-details').remove();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

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

  #handleOpenPopup = () => {
    if (!this.#state.isOpen) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#state, this.#changeData);
      this.#filmDetailsPresenter.init(this.#film);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#escKeyDownHandler);
    }
    this.#state.isOpen = true;
  }
}
