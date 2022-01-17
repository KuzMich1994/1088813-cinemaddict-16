import FilmDetailsView from '../view/film-details/film-details-view';
import FilmDetailsControlsView from '../view/film-details/film-details-controls-view';
import {remove, render, RenderPosition} from '../utils/render';
import FilmDetailsNewCommentView from '../view/film-details/film-details-new-comment-view';
import FilmDetailsCommentView from '../view/film-details/film-details-comment-view';
import {UpdateType, UserAction} from '../const';
import CommentsCounterView from '../view/film-details/comments-counter-view';

export default class FilmDetailsPresenter {
  #filmDetailsComponent = null;
  #filmDetailsControlsComponent = null;
  #filmDetailsCommentComponent = null;
  #filmDetailsNewCommentComponent = null;
  #filmDetailsCommentsCounter = null;

  #footer = document.querySelector('.footer');
  #filmDetailsTopContainer = null;
  #filmDetailsCommentsTitle = null;

  #state = null;
  #changeData = null;
  #film = null;
  #commentsModel = null;
  #filmsModel = null;
  #handleChangeList = null;

  constructor({state, changeData, commentsModel, filmsModel, handleChangeList}) {
    this.#changeData = changeData;
    this.#state = state;
    this.#commentsModel = commentsModel;
    this.#filmsModel = filmsModel;
    this.#handleChangeList = handleChangeList;

    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get comments() {
    // const comments = this.#commentsModel.comments;
    // const film = this.#filmsModel.films.find((currentFilm) => currentFilm.id === this.#film.id);
    // const filmComments = film.comments = comments;

    return this.#commentsModel.comments;
  }

  init = (film) => {
    this.#film = film;

    this.#commentsModel.comments = this.#film.comments;

    this.#filmDetailsComponent = new FilmDetailsView(this.#film);
    this.#filmDetailsControlsComponent = new FilmDetailsControlsView(this.#film);
    this.#filmDetailsNewCommentComponent = new FilmDetailsNewCommentView(this.comments);
    this.#filmDetailsTopContainer = this.#filmDetailsComponent.element.querySelector('.film-details__top-container');
    this.#filmDetailsCommentsTitle = this.#filmDetailsComponent.element.querySelector('.film-details__comments-title');
    this.#filmDetailsCommentsCounter = new CommentsCounterView(this.comments);
    this.#filmDetailsCommentComponent = new FilmDetailsCommentView(this.comments);
    this.#filmDetailsComponent.setClosePopupClickHandler(this.#handleClosePopup);
    this.#filmDetailsNewCommentComponent.setFormSubmitHandler(this.#handleAddComment);
    this.#filmDetailsCommentComponent.setDeleteCommentClickHandler(this.#handleDeleteComment);
    this.#setControlsHandlers();

    this.#renderPopup();
  }

  destroy = () => {
    remove(this.#filmDetailsComponent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT: {
        this.#commentsModel.addComment(updateType, update);
        break;
      }
      case UserAction.REMOVE_COMMENT: {
        this.#commentsModel.deleteComment(updateType, update);
        break;
      }
    }
  }

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.MINOR: {
        this.#rerenderCommentsComponent(this.comments);
        this.#film.comments = this.comments;
        this.#handleChangeList();
        break;
      }
    }
  }

  #renderPopup = () => {
    render(this.#footer, this.#filmDetailsComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsTopContainer, this.#filmDetailsControlsComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsCommentsTitle, this.#filmDetailsCommentComponent, RenderPosition.AFTEREND);
    render(this.#filmDetailsCommentsTitle, this.#filmDetailsCommentsCounter, RenderPosition.BEFOREEND);
    render(this.#filmDetailsCommentComponent, this.#filmDetailsNewCommentComponent, RenderPosition.AFTEREND);
  }

  #rerenderCommentsComponent = (comments) => {
    remove(this.#filmDetailsCommentsCounter);
    this.#filmDetailsCommentsCounter = new CommentsCounterView(comments);
    render(this.#filmDetailsCommentsTitle, this.#filmDetailsCommentsCounter, RenderPosition.BEFOREEND);
    remove(this.#filmDetailsCommentComponent);
    this.#filmDetailsCommentComponent = new FilmDetailsCommentView(comments);
    this.#filmDetailsCommentComponent.setDeleteCommentClickHandler(this.#handleDeleteComment);
    render(this.#filmDetailsCommentsTitle, this.#filmDetailsCommentComponent, RenderPosition.AFTEREND);
    remove(this.#filmDetailsNewCommentComponent);
    this.#filmDetailsNewCommentComponent = new FilmDetailsNewCommentView(comments);
    this.#filmDetailsNewCommentComponent.setFormSubmitHandler(this.#handleAddComment);
    render(this.#filmDetailsCommentComponent, this.#filmDetailsNewCommentComponent, RenderPosition.AFTEREND);
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

  #handleAddComment = (comment) => {
    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      comment
    );
  }

  #handleDeleteComment = (dataId) => {
    this.#handleViewAction(
      UserAction.REMOVE_COMMENT,
      UpdateType.MINOR,
      dataId
      // this.comments.find((comment) => comment.id === dataId),
    );
  }

  #escKeyDownHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.#state.isOpen = false;
      remove(this.#filmDetailsComponent);
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleClosePopup = () => {
    this.#state.isOpen = false;
    remove(this.#filmDetailsComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
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
