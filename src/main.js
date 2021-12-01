import FilmCardView from './view/film-card-view';
import FilmsListView from './view/films-list-view';
import FilmsView from './view/films-view';
import HeaderProfileView from './view/header-profile-view';
import MainNavigationView from './view/navigation-view';
import SortView from './view/sort-view';
import { RenderPosition, render } from './render';
import ShowMoreView from './view/show-more-button-view';
import FilmsCounterView from './view/films-counter-view';
import FilmDetailsView from './view/film-details-view';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import { FILMS_LIST_COUNTER, FILMS_COUNTER_PER_STEP } from './const';
import FilmsListContainerView from './view/films-list-container';
import { generateComment } from './mock/comments';

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStatistics = footer.querySelector('.footer__statistics');

const getAllFilms = () => {
  const filmsList = [];
  for (let i = 0; i < FILMS_LIST_COUNTER; i++) {
    filmsList.push(generateFilm());
  }
  return filmsList;
};

const filmsFixture = getAllFilms();
const filters = generateFilter(filmsFixture);


const filmsComponent = new FilmsView();
const filmListComponent = new FilmsListView();
const filmListContainerComponent = new FilmsListContainerView();

const renderFilm = (containerElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmDetailsView(film, generateComment);

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    render(footer, filmDetailsComponent.element, RenderPosition.AFTEREND);
    document.body.classList.add('hide-overflow');
  });

  filmDetailsComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    filmDetailsComponent.element.remove();
    document.body.classList.remove('hide-overflow');
  });
  render(containerElement, filmComponent.element, RenderPosition.BEFOREEND);
};

render(header, new HeaderProfileView().element, RenderPosition.BEFOREEND);
render(main, new MainNavigationView(filters).element, RenderPosition.BEFOREEND);
render(main, new SortView().element, RenderPosition.BEFOREEND);
render(main, filmsComponent.element, RenderPosition.BEFOREEND);
render(filmsComponent.element, filmListComponent.element, RenderPosition.BEFOREEND);
render(filmListComponent.element, filmListContainerComponent.element, RenderPosition.BEFOREEND);

for (let i = 0; i < Math.min(filmsFixture.length, FILMS_COUNTER_PER_STEP); i++) {
  renderFilm(filmListContainerComponent.element, filmsFixture[i]);
}

if (filmsFixture.length > FILMS_COUNTER_PER_STEP) {
  let renderFilmCount = FILMS_COUNTER_PER_STEP;
  render(filmListContainerComponent.element, new ShowMoreView().element, RenderPosition.AFTEREND);

  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (e) => {
    e.preventDefault();
    filmsFixture
      .slice(renderFilmCount, renderFilmCount + FILMS_COUNTER_PER_STEP)
      .forEach((film) => renderFilm(filmListContainerComponent.element, film));
    renderFilmCount += FILMS_COUNTER_PER_STEP;

    if (renderFilmCount >= filmsFixture.length) {
      showMoreButton.remove();
    }

  });
}
render(footerStatistics, new FilmsCounterView(filmsFixture).element, RenderPosition.BEFOREEND);
