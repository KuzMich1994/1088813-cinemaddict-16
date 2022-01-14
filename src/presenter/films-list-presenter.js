import ShowMoreView from '../view/show-more-button-view';
import {FILMS_COUNTER_PER_STEP, SortType, UpdateType, UserAction} from '../const';
import { remove, render, RenderPosition } from '../utils/render';
import SortView from '../view/sort-view';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmsListTitleView from '../view/films-list-title-view';
import FilmsListContainerView from '../view/films-list-container';
import FilmCardPresenter from './film-card-presenter';
import dayjs from 'dayjs';
import {filter} from '../utils/filter';

export default class FilmsListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = null;
  #filmsListContainerComponent = null;
  #showMoreButtonComponent = null;
  #sortComponent = null;
  // #filtersComponent = null;


  #mainContainer = null;

  #state = {
    isOpen: false,
  };

  #renderedFilmCount = FILMS_COUNTER_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filmsModel = null;
  #filtersModel = null;
  #commentsModel = null;

  constructor(mainContainer, filmsModel, filtersModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
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

  init = () => {
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
        this.#filmPresenter.get(data.id).init(data);
        break;
      }
      case UpdateType.MINOR: {
        if (this.#filtersModel.filter === 'ALL') {
          this.#handleFilmSectionChange();
          return;
        }
        this.#clearFilmsList();

        this.#rerenderFilms();
        break;
      }
      case UpdateType.MAJOR: {
        this.#clearFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderFilmsSection();
        break;
      }
    }
  }

  // #handleChangeFilters = () => {
  //   remove(this.#filtersComponent);
  //   this.#initFiltersComponent();
  //   render(this.#mainContainer, this.#filtersComponent, RenderPosition.AFTERBEGIN);
  // }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    remove(this.#sortComponent);
    this.#clearFilmsList({resetRenderedFilmsCount: true});
    this.#renderFilmsSection();
  }

  #clearFilmsList = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    remove(this.#sortComponent);
    remove(this.#filmsComponent);
    remove(this.#showMoreButtonComponent);
    // remove(this.#filtersComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmCount = FILMS_COUNTER_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  // #initFiltersComponent = () => {
  //   this.#filtersComponent = new MainNavigationView(generateFilter(this.films));
  // }

  // #renderFilters = () => {
  //   this.#initFiltersComponent();
  //   render(this.#mainContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
  // }

  #rerenderFilms = () => {
    const films = this.films;

    this.#renderSort();
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    this.#renderFilmsListSection();
    this.#renderFilmsListContainer();

    films.forEach((film) => this.#rerenderFilm(film));

  }

  #rerenderFilm = (film) => {
    this.#filmPresenter.forEach((presenter) => presenter.rerender(film));
    // this.#renderFilmDetails(film);

  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmCardPresenter(this.#filmsListContainerComponent, this.#handleViewAction, this.#state);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
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

  #handleFilmSectionChange = () => {
    const filmCount = this.films.length;
    const films = this.films;

    films.slice(0, Math.min(filmCount, this.#renderedFilmCount)).forEach((film) => {
      this.#filmPresenter.get(film.id).init(film);
    });
  }

  #renderNoFilms = (filmsList) => {
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

  // #renderFilmDetails = (filmData) => {
  //   const filmPresenter = this.#filmPresenter.get(filmData.id);
  //   filmPresenter.handleFilmDetailsChange(filmData);
  // };
}

