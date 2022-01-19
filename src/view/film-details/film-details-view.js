
import ComponentView from '../component-view';
import dayjs from 'dayjs';
import {getTimeFromMins} from '../../utils/common';

const createFilmDetailsTemplate = (film) => {
  const {name, originalName, description, poster, rating, ageRating, release, director, actor, writers, runtime, genre} = film;
  const fullReleaseDate = dayjs(release.date).format('D MMMM YYYY');

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>

          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name ? name : ''}</h3>
                  <p class="film-details__title-original">Original: ${originalName ? originalName : ''}</p>
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
                  <td class="film-details__cell">${fullReleaseDate}</td>
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
        </div>

        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">


          </section>
        </div>
      </form>
    </section>`
  );
};


export default class FilmDetailsView extends ComponentView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film);
  }

  setClosePopupClickHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  }

  #closePopupClickHandler = (e) => {
    e.preventDefault();
    this._callback.closePopup();
  }
}
