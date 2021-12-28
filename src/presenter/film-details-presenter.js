import FilmDetailsView from '../view/film-details/film-details-view';
import FilmDetailsControlsView from '../view/film-details/film-details-controls-view';
import {remove, render, RenderPosition} from '../utils/render';
import FilmDetailsNewCommentView from '../view/film-details/film-details-new-comment-view';
import FilmDetailsCommentView from '../view/film-details/film-details-comment-view';

export default class FilmDetailsPresenter {
  #filmDetailsComponent = null;
  #filmDetailsControlsComponent = null;
  #filmDetailsCommentComponent = null;
  #filmDetailsNewCommentComponent = null;

  #footer = document.querySelector('.footer');
  #filmDetailsTopContainer = null;
  #filmDetailsCommentsList = null;

  #state = null;
  #changeData = null;
  #film = null;

  constructor(changeData, state) {
    this.#changeData = changeData;
    this.#state = state;
  }

  init = (film) => {
    this.#film = film;

    this.#filmDetailsComponent = new FilmDetailsView(this.#film);
    this.#filmDetailsControlsComponent = new FilmDetailsControlsView(this.#film);
    this.#filmDetailsNewCommentComponent = new FilmDetailsNewCommentView(this.#film.comments);
    this.#filmDetailsTopContainer = this.#filmDetailsComponent.element.querySelector('.film-details__top-container');
    this.#filmDetailsCommentsList = this.#filmDetailsComponent.element.querySelector('.film-details__comments-list');
    this.#filmDetailsComponent.setClosePopupClickHandler(this.#handleClosePopup);
    this.#filmDetailsNewCommentComponent.setFormSubmitHandler(this.#formSubmitHandler);
    this.#setControlsHandlers();

    this.#renderPopup();
  }

  #renderPopup = () => {
    render(this.#footer, this.#filmDetailsComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsTopContainer, this.#filmDetailsControlsComponent, RenderPosition.BEFOREEND);
    this.#film.comments.map((comment) => {
      this.#filmDetailsCommentComponent = new FilmDetailsCommentView(comment);
      render(this.#filmDetailsCommentsList, this.#filmDetailsCommentComponent, RenderPosition.BEFOREEND);
    });
    render(this.#filmDetailsCommentsList, this.#filmDetailsNewCommentComponent, RenderPosition.AFTEREND);
  }

  #formSubmitHandler = () => {
    this.#film.comments.push(this.#filmDetailsNewCommentComponent.data);
    this.#film.comments.map((comment) => {
      remove(this.#filmDetailsCommentComponent);
      this.#filmDetailsCommentComponent = new FilmDetailsCommentView(comment);
      render(this.#filmDetailsCommentsList, this.#filmDetailsCommentComponent, RenderPosition.BEFOREEND);
    });
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
    render(this.#filmDetailsTopContainer, this.#filmDetailsControlsComponent, RenderPosition.BEFOREEND);
  }
}
