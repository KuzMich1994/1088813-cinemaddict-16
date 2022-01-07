export const FILMS_LIST_COUNTER = 20;
export const FILMS_COUNTER_PER_STEP = 5;
export const FilmsListTitles = {
  all: 'All movies. Upcoming',
  favorites: 'Favorites movies',
  watchList: 'In watchlist',
  history: 'Browsing history',
  topRated: 'Top Rated',
  mostCommented: 'Most commented',
};

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  REMOVE_COMMENT: 'REMOVE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
