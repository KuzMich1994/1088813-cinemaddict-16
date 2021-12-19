import dayjs from 'dayjs';
import ComponentView from '../component-view';
import {getTimeFromMins} from '../../utils/common';

const createFilmDetailsInfo = (film) => {
  const { name, description, poster, rating, release, director, actor, writers, runtime, genre } = film;
  const fullDate = dayjs(release.date).format('D MMMM YYYY');
  return (
    `<div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name ? name : ''}</h3>
              <p class="film-details__title-original">Original: ${name ? name : ''}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating ? rating : ''}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director ? director : ''}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers ? writers.join(', ') : ''}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actor ? actor.join(', ') : ''}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${fullDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runtime ? getTimeFromMins(runtime) : ''}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${genre.map((genreElement) => `<span class="film-details__genre">${genreElement}</span>`).join('')}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description ? description : ''}
          </p>
        </div>
      </div>`
  );
};

export default class FilmDetailsInfoView extends ComponentView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDetailsInfo(this.#film);
  }
}
