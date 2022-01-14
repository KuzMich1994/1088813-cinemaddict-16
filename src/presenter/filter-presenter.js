import {FilterType, UpdateType} from '../const';
import {filter} from '../utils/filter';
import MainNavigationView from '../view/navigation-view';
import {remove, render, RenderPosition} from '../utils/render';

export default class FilterPresenter {
  #mainContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filtersComponent = null;

  constructor(mainContainer, filterModel, filmsModel) {
    this.#mainContainer = mainContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

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
    this.#filtersComponent = new MainNavigationView(filters, this.#filterModel.filter);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  }

  #renderFilters = () => {
    render(this.#mainContainer, this.#filtersComponent, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
