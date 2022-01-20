import FilmDetailsView from '../view/film-details/film-details-view';
import FilmDetailsControlsView from '../view/film-details/film-details-controls-view';
import {remove, render, RenderPosition} from '../utils/render';
import FilmDetailsNewCommentView from '../view/film-details/film-details-new-comment-view';
import FilmDetailsCommentView from '../view/film-details/film-details-comment-view';
import {UpdateType, UserAction} from '../const';
import CommentsCounterView from '../view/film-details/comments-counter-view';
import FilmDetailsCommentsLoadingView from '../view/film-details/film-details-comments-loading-view';
import FilmDetailsCommentsTitleView from '../view/film-details/film-details-comments-title-view';

export default class FilmDetailsPresenter {
  #filmDetailsComponent = null;
  #filmDetailsControlsComponent = null;
  #filmDetailsCommentComponent = null;
  #filmDetailsNewCommentComponent = null;
  #filmDetailsCommentsCounter = null;
  #filmDetailsCommentsTitleComponent = null;
  #filmDetailsCommentsLoadingComponent = new FilmDetailsCommentsLoadingView();

  #footer = document.querySelector('.footer');
  #filmDetailsTopContainer = null;
  #filmDetailsCommentsWrapper = null;

  #state = null;
  #changeData = null;
  #film = null;
  #commentsModel = null;
  #filmsModel = null;
  #handleChangeList = null;
  #isLoading = true;

  constructor({state, changeData, commentsModel, filmsModel, handleChangeList}) {
    this.#changeData = changeData;
    this.#state = state;
    this.#commentsModel = commentsModel;
    this.#filmsModel = filmsModel;
    this.#handleChangeList = handleChangeList;

    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init = (film) => {
    this.#film = film;
    this.#initPopup();
    this.#initComments();
  }

  destroy = () => {
    remove(this.#filmDetailsComponent);
  }

  #initComments = async () => {
    await this.#commentsModel.init(this.#film.id);
    this.#filmDetailsNewCommentComponent = new FilmDetailsNewCommentView(this.#commentsModel.comments);
    this.#filmDetailsCommentsCounter = new CommentsCounterView(this.#commentsModel.comments);
    this.#filmDetailsCommentComponent = new FilmDetailsCommentView(this.#commentsModel.comments);
    this.#filmDetailsNewCommentComponent.setFormSubmitHandler(this.#handleAddComment);
    this.#filmDetailsCommentComponent.setDeleteCommentClickHandler(this.#handleDeleteComment);
    this.#renderComments();
  }

  #initPopup = () => {
    this.#filmDetailsComponent = new FilmDetailsView(this.#film);
    this.#filmDetailsControlsComponent = new FilmDetailsControlsView(this.#film);
    this.#filmDetailsTopContainer = this.#filmDetailsComponent.element.querySelector('.film-details__top-container');
    this.#filmDetailsCommentsWrapper = this.#filmDetailsComponent.element.querySelector('.film-details__comments-wrap');
    this.#filmDetailsCommentsTitleComponent = new FilmDetailsCommentsTitleView();
    this.#filmDetailsComponent.setClosePopupClickHandler(this.#handleClosePopup);
    this.#setControlsHandlers();
    this.#renderPopup();
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
        this.#rerenderCommentsComponent(this.#commentsModel.comments);
        this.#film.comments = this.#commentsModel.comments;
        this.#handleChangeList();
        break;
      }
      case UpdateType.INIT: {
        this.#isLoading = false;
        remove(this.#filmDetailsCommentsLoadingComponent);
        render(this.#filmDetailsCommentsWrapper, this.#filmDetailsCommentsTitleComponent, RenderPosition.BEFOREEND);
      }
    }
  }

  #renderComments = () => {
    render(this.#filmDetailsCommentsTitleComponent, this.#filmDetailsCommentComponent, RenderPosition.AFTEREND);
    render(this.#filmDetailsCommentsTitleComponent, this.#filmDetailsCommentsCounter, RenderPosition.BEFOREEND);
    render(this.#filmDetailsCommentComponent, this.#filmDetailsNewCommentComponent, RenderPosition.AFTEREND);
  }

  #renderPopup = () => {
    render(this.#footer, this.#filmDetailsComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsTopContainer, this.#filmDetailsControlsComponent, RenderPosition.BEFOREEND);
    render(this.#filmDetailsCommentsWrapper, this.#filmDetailsCommentsLoadingComponent, RenderPosition.BEFOREEND);
  }

  #rerenderCommentsComponent = (comments) => {
    remove(this.#filmDetailsCommentsCounter);
    this.#filmDetailsCommentsCounter = new CommentsCounterView(comments);
    render(this.#filmDetailsCommentsTitleComponent, this.#filmDetailsCommentsCounter, RenderPosition.BEFOREEND);
    remove(this.#filmDetailsCommentComponent);
    this.#filmDetailsCommentComponent = new FilmDetailsCommentView(comments);
    this.#filmDetailsCommentComponent.setDeleteCommentClickHandler(this.#handleDeleteComment);
    render(this.#filmDetailsCommentsTitleComponent, this.#filmDetailsCommentComponent, RenderPosition.AFTEREND);
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
