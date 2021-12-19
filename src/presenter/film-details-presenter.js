import FilmDetailsView from '../view/film-details/film-details-view';
import FilmDetailsFormView from '../view/film-details/film-details-form-view';
import FilmDetailsTopContainerView from '../view/film-details/film-details-top-container-view';
import FilmDetailsCloseView from '../view/film-details/film-details-close-view';
import FilmDetailsInfoView from '../view/film-details/film-details-info-view';
import FilmDetailsControlsView from '../view/film-details/film-details-controls-view';
import FilmDetailsBottomContainerView from '../view/film-details/film-details-bottom-container-view';
import {generateComment} from '../mock/comments';
import {remove, render, RenderPosition} from '../utils/render';

export default class FilmDetailsPresenter {
  #filmDetailsComponent = null;
  #filmDetailsFormComponent = null;
  #filmDetailsTopContainerComponent = null;
  #filmDetailsCloseComponent = null;
  #filmDetailsInfoComponent = null;
  #filmDetailsControlsComponent = null;
  #filmDetailsBottomContainerComponent = null;

  #footer = document.querySelector('.footer');

  #state = null;
  #changeData = null;
  #film = null;

  constructor(changeData, state) {
    this.#changeData = changeData;
    this.#state = state;
  }

  init = (film) => {
    this.#film = film;

    this.#filmDetailsComponent = new FilmDetailsView();
    this.#filmDetailsFormComponent = new FilmDetailsFormView();
    this.#filmDetailsTopContainerComponent = new FilmDetailsTopContainerView();
    this.#filmDetailsCloseComponent = new FilmDetailsCloseView();
    this.#filmDetailsInfoComponent = new FilmDetailsInfoView(this.#film);
    this.#filmDetailsControlsComponent = new FilmDetailsControlsView(this.#film);
    this.#filmDetailsBottomContainerComponent = new FilmDetailsBottomContainerView(this.#film, generateComment);
    this.#filmDetailsCloseComponent.setClosePopupClickHandler(this.#handleClosePopup);
    this.#setControlsHandlers();

    this.#renderPopup();
  }

  #renderPopup = () => {
    render(this.#footer, this.#filmDetailsComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsComponent, this.#filmDetailsFormComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsFormComponent, this.#filmDetailsTopContainerComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsFormComponent, this.#filmDetailsBottomContainerComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsTopContainerComponent, this.#filmDetailsCloseComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsTopContainerComponent, this.#filmDetailsInfoComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsTopContainerComponent, this.#filmDetailsControlsComponent, RenderPosition.BEFOREEND);
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#film, isAlreadyWatched: !this.#film.isAlreadyWatched});
  }

  #handleWatchListClick = () => {
    this.#changeData({...this.#film, isWatchList: !this.#film.isWatchList});
  }

  #onEscKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.#state.isOpen = false;
      remove(this.#filmDetailsComponent);
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleClosePopup = () => {
    this.#state.isOpen = false;
    remove(this.#filmDetailsComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #setControlsHandlers = () => {
    this.#filmDetailsControlsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetailsControlsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmDetailsControlsComponent.setWatchlistClickHandler(this.#handleWatchListClick);
  }

  handleControlsChange = (film) => {
    this.#film = film;
    remove(this.#filmDetailsControlsComponent);
    this.#filmDetailsControlsComponent = new FilmDetailsControlsView(film);
    this.#setControlsHandlers();
    render(this.#filmDetailsTopContainerComponent, this.#filmDetailsControlsComponent, RenderPosition.BEFOREEND);
  }
}
