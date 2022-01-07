import ShowMoreView from '../view/show-more-button-view';
import {FILMS_COUNTER_PER_STEP, SortType, UpdateType, UserAction} from '../const';
import { remove, render, RenderPosition } from '../utils/render';
import SortView from '../view/sort-view';
import MainNavigationView from '../view/navigation-view';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmsListTitleView from '../view/films-list-title-view';
import FilmsListContainerView from '../view/films-list-container';
import { generateFilter } from '../mock/filter';
import FilmCardPresenter from './film-card-presenter';
import dayjs from 'dayjs';

export default class FilmsListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = null;
  #filmsListContainerComponent = null;
  #showMoreButtonComponent = null;
  #sortComponent = null;
  #filtersComponent = null;


  #mainContainer = null;

  #state = {
    isOpen: false,
  };

  #renderedFilmCount = FILMS_COUNTER_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filmsModel = null;

  constructor(mainContainer, filmsModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.BY_DATE: {
        return [...this.#filmsModel.films].sort((a, b) => dayjs(a.release.date).year() > dayjs(b.release.date).year() ? 1 : -1);
      }
      case SortType.BY_RATING: {
        return [...this.#filmsModel.films].sort((a, b) => a.rating > b.rating ? 1 : -1);
      }
    }
    return  this.#filmsModel.films;
  }

  init = () => {

    this.#renderFilmsSection();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM: {
        this.#filmsModel.updateFilms(updateType, update);
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
        this.#handleChangeFilters();
        this.#handleFilmSectionChange();
        this.#renderFilmDetails(data);
        break;
      }
      case UpdateType.MAJOR: {
        break;
      }
    }
  }

  #handleChangeFilters = () => {
    remove(this.#filtersComponent);
    this.#initFiltersComponent();
    render(this.#mainContainer, this.#filtersComponent, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    remove(this.#sortComponent);
    this.#clearFilmsList();
    this.#renderFilmsSection();
  }

  #clearFilmsList = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    remove(this.#sortComponent);
    remove(this.#filmsComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#filtersComponent);

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

  #initFiltersComponent = () => {
    this.#filtersComponent = new MainNavigationView(generateFilter(this.films));
  }

  #renderFilters = () => {
    this.#initFiltersComponent();
    render(this.#mainContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmCardPresenter(this.#filmsListContainerComponent, this.#handleViewAction, this.#state, this.#filmsModel);
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
    render(filmsList, new FilmsListTitleView('There are no movies in our database'), RenderPosition.BEFOREEND);
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
    this.#renderFilters();
    this.#renderSort();
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    this.#renderFilmsListSection();
    this.#renderFilmsListContainer();

    this.#renderFilmsList();
  }

  #renderFilmDetails = (filmData) => {
    const filmPresenter = this.#filmPresenter.get(filmData.id);
    filmPresenter.handleFilmDetailsChange(filmData);
  };
}

