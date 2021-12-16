import ShowMoreView from '../view/show-more-button-view';
import {FILMS_COUNTER_PER_STEP, SortType} from '../const';
import { remove, render, RenderPosition } from '../utils/render';
import SortView from '../view/sort-view';
import MainNavigationView from '../view/navigation-view';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmsListTitleView from '../view/films-list-title-view';
import FilmsListContainerView from '../view/films-list-container';
import { generateFilter } from '../mock/filter';
import FilmCardPresenter from './film-card-presenter';
import {updateItem} from '../utils/common';
import dayjs from 'dayjs';

export default class FilmsListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = null;
  #filmsListContainerComponent = null;
  #showMoreButton = new ShowMoreView();
  #sortComponent = new SortView();
  #filtersComponent = null;

  #mainContainer = null;

  #state = {
    isOpen: false,
  };

  #renderFilmCount = FILMS_COUNTER_PER_STEP;
  #filmsData = [];
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourceFilmsData = [];

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (films) => {
    this.#filmsData = films;
    this.#sourceFilmsData = [...films];
    this.#filtersComponent = new MainNavigationView(generateFilter(this.#filmsData));

    this.#renderFilters();
    this.#renderSort();

    this.#renderFilmsContainer();
  }

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE: {
        this.#filmsData.sort((a, b) => dayjs(a.release.date).year() > dayjs(b.release.date).year() ? 1 : -1);
        break;
      }
      case SortType.BY_RATING: {
        this.#filmsData.sort((a, b) => a.rating > b.rating ? 1 : -1);
        break;
      }
      default: {
        this.#filmsData = [...this.#sourceFilmsData];
      }
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
  }

  #renderSort = () => {
    render(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilters = () => {
    render(this.#mainContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#filmsData = updateItem(this.#filmsData, updatedFilm);
    this.#sourceFilmsData = updateItem(this.#sourceFilmsData, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmCardPresenter(this.#filmsListContainerComponent, this.#handleFilmChange, this.#state);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderFilmCount = FILMS_COUNTER_PER_STEP;
    remove(this.#showMoreButton);
  }

  #renderFilms = (from, to) => {
    this.#filmsData
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderFilmCount, this.#renderFilmCount + FILMS_COUNTER_PER_STEP);
    this.#renderFilmCount += FILMS_COUNTER_PER_STEP;

    if (this.#renderFilmCount >= this.#filmsData.length) {
      remove(this.#showMoreButton);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmsListContainerComponent, this.#showMoreButton, RenderPosition.AFTEREND);

    this.#showMoreButton.setAddCardsClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderFilmsList = () => {
    this.#renderFilms(0, Math.min(this.#filmsData.length, FILMS_COUNTER_PER_STEP));

    if (this.#filmsData.length > FILMS_COUNTER_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderNoFilms = (filmsList) => {
    if (this.#filmsData.length === 0) {
      render(filmsList, new FilmsListTitleView('There are no movies in our database'), RenderPosition.BEFOREEND);
    }
  }

  #renderFilmsListComponent = () => {
    this.#filmsListComponent = new FilmsListView();
    this.#renderNoFilms(this.#filmsListComponent);
    render(this.#filmsComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListContainerComponent = () => {
    this.#filmsListContainerComponent = new FilmsListContainerView();
    render(this.#filmsListComponent, this.#filmsListContainerComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsContainer = () => {
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    this.#renderFilmsListComponent();
    this.#renderFilmsListContainerComponent();

    this.#renderFilmsList();
  }
}

