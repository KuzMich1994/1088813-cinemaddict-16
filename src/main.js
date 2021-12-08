import FilmCardView from './view/film-card-view';
import FilmsListView from './view/films-list-view';
import FilmsView from './view/films-view';
import HeaderProfileView from './view/header-profile-view';
import MainNavigationView from './view/navigation-view';
import SortView from './view/sort-view';
import { RenderPosition, render } from './utils/render';
import ShowMoreView from './view/show-more-button-view';
import FilmsCounterView from './view/films-counter-view';
import FilmDetailsView from './view/film-details-view';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import { FILMS_LIST_COUNTER, FILMS_COUNTER_PER_STEP } from './const';
import FilmsListContainerView from './view/films-list-container';
import { generateComment } from './mock/comments';
import FilmsListTileView from './view/films-list-title-view';

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
const showMoreButtonComponent = new ShowMoreView();

const renderFilm = (containerElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmDetailsView(film, generateComment);

  const onEscKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      filmDetailsComponent.element.remove();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmComponent.setOpenPopupClickHandler(() => {
    render(footer, filmDetailsComponent, RenderPosition.AFTEREND);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmDetailsComponent.setClosePopupClickHandler(() => {
    filmDetailsComponent.removeElement();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  });


  render(containerElement, filmComponent, RenderPosition.BEFOREEND);
};

render(header, new HeaderProfileView(), RenderPosition.BEFOREEND);
render(main, new MainNavigationView(filters), RenderPosition.BEFOREEND);
render(main, new SortView(), RenderPosition.BEFOREEND);
render(main, filmsComponent, RenderPosition.BEFOREEND);
render(filmsComponent, filmListComponent, RenderPosition.BEFOREEND);
render(filmListComponent, filmListContainerComponent, RenderPosition.BEFOREEND);

if (filmsFixture.length === 0) {
  render(filmListComponent, new FilmsListTileView('There are no movies in our database'), RenderPosition.AFTERBEGIN);
} else {
  render(filmListComponent, new FilmsListTileView('All movies. Upcoming', 'visually-hidden'), RenderPosition.AFTERBEGIN);
}

for (let i = 0; i < Math.min(filmsFixture.length, FILMS_COUNTER_PER_STEP); i++) {
  renderFilm(filmListContainerComponent, filmsFixture[i]);
}

if (filmsFixture.length > FILMS_COUNTER_PER_STEP) {
  let renderFilmCount = FILMS_COUNTER_PER_STEP;
  render(filmListContainerComponent, showMoreButtonComponent, RenderPosition.AFTEREND);

  showMoreButtonComponent.setAddCardsClickHandler(() => {
    filmsFixture
      .slice(renderFilmCount, renderFilmCount + FILMS_COUNTER_PER_STEP)
      .forEach((film) => renderFilm(filmListContainerComponent, film));
    renderFilmCount += FILMS_COUNTER_PER_STEP;

    if (renderFilmCount >= filmsFixture.length) {
      showMoreButtonComponent.removeElement();
    }

  });
}
render(footerStatistics, new FilmsCounterView(filmsFixture), RenderPosition.BEFOREEND);
