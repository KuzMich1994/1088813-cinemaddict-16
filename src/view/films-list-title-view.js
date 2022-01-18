import ComponentView from './component-view';
import {FilterType} from '../const';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no films in the list to watch',
  [FilterType.HISTORY]: 'No movies in watch history',
  [FilterType.FAVORITES]: 'No movies in favorites',
};

const createFilmsListTitle = (filterType) => {
  const noFilmTextValue = NoFilmsTextType[filterType];

  return (
    `<h2 class="films-list__title">${noFilmTextValue}</h2>`
  );
};

export default class FilmsListTileView extends ComponentView {
  #filtersType = null;

  constructor(filtersType) {
    super();

    this.#filtersType = filtersType;
  }

  get template() {
    return createFilmsListTitle(this.#filtersType);
  }
}
