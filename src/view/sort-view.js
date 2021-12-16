import ComponentView from './component-view';
import {SortType} from '../const';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends ComponentView {
  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (e) => {
    e.preventDefault();
    const target = e.target;
    const currentTarget = e.currentTarget;
    this._callback.sortTypeChange(target.dataset.sortType);

    const sortButtons = currentTarget.querySelectorAll('.sort__button');

    sortButtons.forEach((sortButton) => {
      if (target === sortButton) {
        sortButton.classList.add('sort__button--active');
      } else {
        sortButton.classList.remove('sort__button--active');
      }
    });
  }
}
