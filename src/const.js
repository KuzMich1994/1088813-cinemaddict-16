export const FILMS_COUNTER_PER_STEP = 5;

export const SMILES = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

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
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'ALL',
  WATCHLIST: 'WATCHLIST',
  HISTORY: 'HISTORY',
  FAVORITES: 'FAVORITES',
};

export const Method = {
  PUT: 'PUT',
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const State = {
  ADDITION: 'ADDITION',
  DELETING: 'DELETING',
};

export const AUTHORIZATION = 'Basic ui312gco2n835cy27q5y';
export const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

export const START_STATISTIC_PERIOD = 'all-time';

export const StatisticsRadioButtons = [
  { type : 'all-time', name : 'All time'},
  { type : 'today', name : 'Today'},
  { type : 'week', name : 'Week'},
  { type : 'month', name : 'Month'},
  { type : 'year', name : 'Year'},
];
