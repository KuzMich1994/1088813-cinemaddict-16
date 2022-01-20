import ShowMoreView from '../view/show-more-button-view';
import {FILMS_COUNTER_PER_STEP, FilterType, SortType, UpdateType, UserAction} from '../const';
import { remove, render, RenderPosition } from '../utils/render';
import SortView from '../view/sort-view';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmsListTitleView from '../view/films-list-title-view';
import FilmsListContainerView from '../view/films-list-container';
import FilmCardPresenter from './film-card-presenter';
import dayjs from 'dayjs';
import {filter} from '../utils/filter';
import FilmDetailsPresenter from './film-details-presenter';
import LoadingView from '../view/loading-view';
import FilmsCounterView from '../view/films-counter-view';
import HeaderProfileView from '../view/header-profile-view';

export default class FilmsListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = null;
  #filmsListContainerComponent = null;
  #showMoreButtonComponent = null;
  #sortComponent = null;
  #loadingComponent = new LoadingView();
  #headerProfileComponent = null;

  #mainContainer = null;
  #footerStatistics = document.querySelector('.footer__statistics');
  #header = document.querySelector('.header');

  #state = {
    isOpen: false,
  };

  #renderedFilmCount = FILMS_COUNTER_PER_STEP;
  #filmPresenters = new Map();
  #filmDetailsPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #filmsModel = null;
  #filtersModel = null;
  #commentsModel = null;
  #isLoading = true;

  constructor(mainContainer, filmsModel, filtersModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const filterType = this.#filtersModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.BY_DATE: {
        return filteredFilms.sort((a, b) => dayjs(a.release.date).year() > dayjs(b.release.date).year() ? 1 : -1);
      }
      case SortType.BY_RATING: {
        return filteredFilms.sort((a, b) => a.rating > b.rating ? 1 : -1);
      }
    }
    return  filteredFilms;
  }

  get historyFilmsCount() {
    const films = this.#filmsModel.films;

    return filter[FilterType.HISTORY](films).length;
  }

  init = () => {
    this.#renderFilmsSection();
  }

  reRenderFilms = () => {
    this.#clearFilmsList();
    this.#renderFilmsSection();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM: {
        this.#filmsModel.updateFilms(updateType, update);
        break;
      }
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

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH: {
        this.#filmPresenters.get(data.id).init(data);
        break;
      }
      case UpdateType.MINOR: {
        if (this.#filmDetailsPresenter !== null) {
          this.#filmDetailsPresenter.handleControlsChange(data);
        }
        this.#clearFilmsList();
        remove(this.#headerProfileComponent);
        this.#renderProfileName();
        this.#renderFilmsSection();
        break;
      }
      case UpdateType.MAJOR: {
        this.#clearFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderFilmsSection();
        break;
      }
      case UpdateType.INIT: {
        this.#isLoading = false;
        this.#clearFilmsList();
        remove(this.#loadingComponent);
        this.#renderProfileName();
        this.#renderFilmsSection();
        this.#renderFooterStatistics();
        break;
      }
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    remove(this.#sortComponent);
    this.#clearFilmsList({resetRenderedFilmsCount: true});
    this.#renderFilmsSection();
  }

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILMS_COUNTER_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #clearFilmsList = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenters.forEach((filmPresenter) => filmPresenter.destroy());

    remove(this.#sortComponent);
    remove(this.#filmsComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmCount = FILMS_COUNTER_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderProfileName = () => {
    this.#headerProfileComponent = new HeaderProfileView(this.historyFilmsCount);
    render(this.#header, this.#headerProfileComponent, RenderPosition.BEFOREEND);
  }

  #renderLoading = () => {
    render(this.#filmsListComponent, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmCardPresenter({
      filmsListContainer: this.#filmsListContainerComponent,
      changeData: this.#handleViewAction,
      handleOpenPopup: this.#renderDetails,
    });

    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreView();
    render(this.#filmsListContainerComponent, this.#showMoreButtonComponent, RenderPosition.AFTEREND);

    this.#showMoreButtonComponent.setAddCardsClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderFilmsList = () => {
    const filmCount = this.films.length;
    const films = this.films;

    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  }

  #renderNoFilms = (filmsList) => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    render(filmsList, new FilmsListTitleView(this.#filtersModel.filter), RenderPosition.BEFOREEND);
  }

  #renderFilmsListSection = () => {
    const filmCount = this.films.length;
    this.#filmsListComponent = new FilmsListView();
    if (filmCount === 0) {
      this.#renderNoFilms(this.#filmsListComponent);
    }
    render(this.#filmsComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListContainer = () => {
    this.#filmsListContainerComponent = new FilmsListContainerView();
    render(this.#filmsListComponent, this.#filmsListContainerComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsSection = () => {
    this.#renderSort();
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    this.#renderFilmsListSection();
    this.#renderFilmsListContainer();
    this.#renderFilmsList();
  }

  #renderFooterStatistics = () => {
    render(this.#footerStatistics, new FilmsCounterView(this.#filmsModel.films), RenderPosition.BEFOREEND);
  }

  #renderDetails = (film) => () => {
    if (!this.#state.isOpen) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter({
        state: this.#state,
        changeData: this.#handleViewAction,
        commentsModel: this.#commentsModel,
        filmsModel: this.#filmsModel,
        handleChangeList: this.reRenderFilms,
      });
      this.#filmDetailsPresenter.init(film);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#escKeyDownHandler);
    }
    this.#state.isOpen = true;
  }

  #escKeyDownHandler = (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc') && this.#state.isOpen) {
      this.#state.isOpen = false;
      this.#filmDetailsPresenter.destroy();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

}

