import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../const';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateFilms = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
    } catch (err) {
      throw new Error('Can\'t update task');
    }

    this._notify(updateType, update);
  }

  #adaptToClient = ({
    id,
    comments: commentsIds,
    'film_info': {
      title: name,
      'alternative_title': originalName,
      'total_rating': rating,
      poster,
      'age_rating': ageRating,
      director,
      writers: writers,
      actors: actor,
      release: {
        date: date,
        'release_country': releaseCountry,
      },
      runtime,
      genre: genre,
      description,
    },
    'user_details': {
      watchlist: isWatchList,
      'already_watched': isAlreadyWatched,
      'watching_date': watchingDate,
      favorite: isFavorite,
    }
  }) => ({
    id,
    poster,
    name,
    originalName,
    rating,
    director,
    writers,
    isWatchList,
    isFavorite,
    isAlreadyWatched,
    watchingDate,
    description,
    genre,
    runtime,
    release: {
      releaseCountry,
      date,
    },
    actor,
    ageRating,
    commentsIds,
  })
}
