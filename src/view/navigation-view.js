import ComponentView from './component-view';

const createFilterItemsTemplate = (filter) => {
  const { name, count } = filter;

  return (`
    
    <a href="#${name}" class="main-navigation__item">${name.substring(0, 1).toUpperCase() + name.substring(1)} <span class="main-navigation__item-count">${count}</span></a>
    
  `);

};

const createMainNavigationTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map((filter) => createFilterItemsTemplate(filter))
    .join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );

};

export default class MainNavigationView extends ComponentView {
  #filters = null;
  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters);
  }
}
