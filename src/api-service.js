import {Method} from './const';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (filmId) => this.#load({url: `comments/${filmId}`})
    .then(ApiService.parseResponse)

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptFilmToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  #adaptFilmToServer = ({
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
    comments,
  }) => ({
    id,
    comments,
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
  })

  #adaptCommentToServer = (comment) => {
    const adaptedComment = {
      comment: comment['commentMessage'],
    };

    delete adaptedComment['commentMessage'];

    return adaptedComment;
  }

  #load = async ({
    url,
    method,
    body,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers}
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
