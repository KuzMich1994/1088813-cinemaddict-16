import ComponentView from './component-view';
import {SortType} from '../const';

const createSortTemplate = (sortType) => (`<ul class="sort">
    <li><a href="#" class="sort__button ${sortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${sortType === SortType.BY_DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${sortType === SortType.BY_RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
  </ul>`);

export default class SortView extends ComponentView {
  #sortType = null;

  constructor(sortType) {
    super();

    this.#sortType = sortType;
  }

  get template() {
    return createSortTemplate(this.#sortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (e) => {
    const target = e.target;

    if (target.tagName !== 'A') {
      return;
    }

    e.preventDefault();
    this._callback.sortTypeChange(target.dataset.sortType);
  }
}
