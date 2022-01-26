import {FilterType, UpdateType} from '../const';
import {filter} from '../utils/filter';
import {remove, render, RenderPosition} from '../utils/render';
import FiltersView from '../view/filters-view';

export default class FilterPresenter {
  #filterModel = null;
  #filmsModel = null;
  #filmsPresenter = null;

  #filtersComponent = null;
  #navigationComponent = null;

  #removeStatistics = null;

  constructor({
    navigationComponent,
    filterModel,
    filmsModel,
    filmsPresenter,
    removeStatistics,
  }) {
    this.#navigationComponent = navigationComponent;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#filmsPresenter = filmsPresenter;

    this.#removeStatistics = removeStatistics;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const prevFiltersComponent = this.#filtersComponent;
    if (prevFiltersComponent !== null) {
      remove(prevFiltersComponent);
    }

    this.#initFiltersComponent();
    this.#renderFilters();

  }

  #initFiltersComponent = () => {
    const filters = this.filters;
    this.#filtersComponent = new FiltersView(filters, this.#filterModel.filter);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  }

  #renderFilters = () => {
    render(this.#navigationComponent, this.#filtersComponent, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    this.#removeStatistics();
    this.#filmsPresenter.reInit();

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
