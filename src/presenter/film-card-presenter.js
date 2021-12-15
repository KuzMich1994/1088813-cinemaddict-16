import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';
import {generateComment} from '../mock/comments';
import {remove, render, RenderPosition, replace} from '../utils/render';

export default class FilmCardPresenter {
  #filmsListContainerComponent = null;
  #changeData = null;

  #filmCardComponent = null;
  #filmDetailsComponent = null;
  #footer = document.querySelector('footer');
  #state = null;

  #film = null;

  constructor(filmsListContainer, changeData, state) {
    this.#filmsListContainerComponent = filmsListContainer;
    this.#changeData = changeData;
    this.#state = state;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);
    this.#filmDetailsComponent = new FilmDetailsView(film, generateComment);

    this.#filmCardComponent.setOpenPopupClickHandler(this.#handleOpenPopup);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetailsComponent.setClosePopupClickHandler(this.#handleClosePopup);

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

  #onEscKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.#state.isOpen = false;
      remove(this.#filmDetailsComponent);
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#film, isAlreadyWatched: !this.#film.isAlreadyWatched});
  }

  #handleWatchlistClick = () => {
    this.#changeData({...this.#film, isWatchList: !this.#film.isFavorite});
  }

  #handleOpenPopup = () => {
    if (!this.#state.isOpen) {
      render(this.#footer, this.#filmDetailsComponent, RenderPosition.AFTEREND);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);
    }
    this.#state.isOpen = true;
  }

  #handleClosePopup = () => {
    this.#state.isOpen = false;
    remove(this.#filmDetailsComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }
}
