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
import dayjs from 'dayjs';

export default class FilmsListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = null;
  #filmsListContainerComponent = null;
  #showMoreButtonComponent = new ShowMoreView();
  #sortComponent = new SortView();
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
    this.#filtersComponent = new MainNavigationView(generateFilter(this.films));

    this.#renderFilters();
    this.#renderSort();

    this.#renderFilmsSection();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
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
    this.#renderedFilmCount = FILMS_COUNTER_PER_STEP;
    remove(this.#showMoreButtonComponent);
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
    render(this.#filmsListContainerComponent, this.#showMoreButtonComponent, RenderPosition.AFTEREND);

    this.#showMoreButtonComponent.setAddCardsClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderFilmsList = () => {
    // this.#renderFilms(0, Math.min(this.#filmsData.length, FILMS_COUNTER_PER_STEP));
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILMS_COUNTER_PER_STEP));

    this.#renderFilms(films);

    if (filmCount > FILMS_COUNTER_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderNoFilms = (filmsList) => {
    if (this.films.length === 0) {
      render(filmsList, new FilmsListTitleView('There are no movies in our database'), RenderPosition.BEFOREEND);
    }
  }

  #renderFilmsListSection = () => {
    this.#filmsListComponent = new FilmsListView();
    this.#renderNoFilms(this.#filmsListComponent);
    render(this.#filmsComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListContainer = () => {
    this.#filmsListContainerComponent = new FilmsListContainerView();
    render(this.#filmsListComponent, this.#filmsListContainerComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsSection = () => {
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    this.#renderFilmsListSection();
    this.#renderFilmsListContainer();

    this.#renderFilmsList();
  }
}

