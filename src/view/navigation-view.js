import ComponentView from './component-view';

const createMainNavigationTemplate = () => (
  `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
);

export default class NavigationView extends ComponentView {
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

  setStatisticsClickHandler = (callback) => {
    this._callback.showStatistics = callback;
    this.element.addEventListener('click', this.#statisticsClickHandler);
  }

  #statisticsClickHandler = (e) => {
    const target = e.target;

    if (target.matches('.main-navigation__additional')) {
      e.preventDefault();
      target.classList.add('main-navigation__additional--active');
      document.querySelectorAll('.main-navigation__item').forEach((navItem) => {
        navItem.classList.remove('main-navigation__item--active');
      });
      this._callback.showStatistics();
    } else {
      document.querySelector('.main-navigation__additional').classList.remove('main-navigation__additional--active');
    }
  }
}
