import ComponentView from './component-view';

const createFilterItemsTemplate = (filter, currentFilterType) => {
  const { name, count, type } = filter;

  if (name === 'All movies') {
    return (
      `<a id="${type}" href="#${name.substring(0, 1).toLowerCase() + name.substring(1)}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">${name}</a>`
    );
  } else {
    return (
      `<a id="${type}" href="#${name.substring(0, 1).toLowerCase() + name.substring(1)}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">${name} <span class="main-navigation__item-count">${count}</span></a>`
    );
  }

};

const createMainNavigationTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters
    .map((filter) => createFilterItemsTemplate(filter, currentFilterType))
    .join('');

  return (
    `<div class="main-navigation__items">
      ${filterItemsTemplate}
     </div>`
  );

};

export default class FiltersView extends ComponentView {
  #filters = null;
  #currentFilter = null;
  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelectorAll('.main-navigation__item')
      .forEach((mainNavigationItem) => {
        mainNavigationItem.addEventListener('click', this.#filterTypeChangeHandler);
      });
    // this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (e) => {
    const target = e.target;

    e.preventDefault();

    this._callback.filterTypeChange(target.id);
  }
}
