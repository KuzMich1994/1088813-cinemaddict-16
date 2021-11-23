import { createFilmCardTemplate } from './view/film-card-view';
import { createFilmsListTemplate } from './view/films-list-view';
import { createFilmsTemplate } from './view/films-view';
import { createHeaderProfileTemplate } from './view/header-profile-view';
import { createMainNavigationTemplate } from './view/navigation-view';
import { createSortTemplate } from './view/sort-view';
import { renderTemplate, RenderPosition } from './render';
import { createShowMoreButtonTemplate } from './view/show-more-button-view';
import { createFilmsCounterTemplate } from './view/films-counter-view';
import { createFilmDetailsTemplate } from './view/film-details-view';

const FILMS_LIST_COUNTER = 5;
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStatistics = footer.querySelector('.footer__statistics');

renderTemplate(header, createHeaderProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(main, createMainNavigationTemplate(), RenderPosition.BEFOREEND);
renderTemplate(main, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(main, createFilmsTemplate(), RenderPosition.BEFOREEND);

const films = document.querySelector('.films');

renderTemplate(films, createFilmsListTemplate(), RenderPosition.BEFOREEND);

const filmsListContainer = document.querySelector('.films-list__container');

for (let i = 0; i < FILMS_LIST_COUNTER; i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(filmsListContainer, createShowMoreButtonTemplate(), RenderPosition.AFTEREND);
renderTemplate(footerStatistics, createFilmsCounterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(footer, createFilmDetailsTemplate(), RenderPosition.AFTEREND);

