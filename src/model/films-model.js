import AbstractObservable from '../utils/abstract-observable';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;

    this.#apiService.films.then((films) => {
      console.log(films.map(this.#adaptToClient));
    });
  }

  set films(films) {
    this.#films = [...films];
  }

  get films() {
    return this.#films;
  }

  updateFilms = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  #adaptToClient = ({
    id,
    comments,
    film_info: {
      title: name,
      alternative_title: originalName,
      total_rating: rating,
      poster,
      age_rating: ageRating,
      director,
      writers: writers,
      actors: actor,
      release: {
        date: date,
        release_country: releaseCountry,
      },
      runtime,
      genre: genre,
      description,
    },
    user_details: {
      watchlist: isWatchlist,
      already_watched: isAlreadyWatched,
      watching_date: watchingDate,
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
    isWatchlist,
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
    comments,
  })
}
