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
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';

const FILMS_LIST_COUNTER = 20;
const FILMS_COUNTER_PER_STEP = 5;
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStatistics = footer.querySelector('.footer__statistics');

const getAllFilms = () => {
  const FILMS_LIST = [];
  for (let i = 0; i < FILMS_LIST_COUNTER; i++) {
    FILMS_LIST.push(generateFilm());
  }
  return FILMS_LIST;
};

const FILMS = getAllFilms();


renderTemplate(header, createHeaderProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(main, createMainNavigationTemplate(generateFilter(FILMS)), RenderPosition.BEFOREEND);
renderTemplate(main, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(main, createFilmsTemplate(), RenderPosition.BEFOREEND);

const films = document.querySelector('.films');

renderTemplate(films, createFilmsListTemplate(), RenderPosition.BEFOREEND);

const filmsListContainer = document.querySelector('.films-list__container');

for (let i = 0; i < Math.min(FILMS.length, FILMS_COUNTER_PER_STEP); i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(FILMS[i]), RenderPosition.BEFOREEND);
}

const showFilmInfo = () => {
  const filmCards = document.querySelectorAll('.film-card');
  filmCards.forEach((filmCard, index) => {
    const hangleOpen = (e) => {
      const target = e.target;

      if (target.closest('.film-card__controls') || target.closest('.film-card__comments')) {
        return;
      }

      renderTemplate(footer, createFilmDetailsTemplate(FILMS[index]), RenderPosition.AFTEREND);

      const closePopupButton = document.querySelector('.film-details__close-btn');
      const infoPopup = document.querySelector('.film-details');
      const handleClose = () => {
        infoPopup.remove();
        closePopupButton.removeEventListener('click', handleClose);
      };

      closePopupButton.addEventListener('click', handleClose);
    };

    filmCard.removeEventListener('click', hangleOpen);
    filmCard.addEventListener('click', hangleOpen);
  });
};

if (FILMS.length > FILMS_COUNTER_PER_STEP) {
  let renderFilmCount = FILMS_COUNTER_PER_STEP;
  renderTemplate(filmsListContainer, createShowMoreButtonTemplate(), RenderPosition.AFTEREND);

  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (e) => {
    e.preventDefault();
    FILMS
      .slice(renderFilmCount, renderFilmCount + FILMS_COUNTER_PER_STEP)
      .forEach((film) => renderTemplate(filmsListContainer, createFilmCardTemplate(film), RenderPosition.BEFOREEND));
    renderFilmCount += FILMS_COUNTER_PER_STEP;

    if (renderFilmCount >= FILMS.length) {
      showMoreButton.remove();
    }

    showFilmInfo();
  });
}
renderTemplate(footerStatistics, createFilmsCounterTemplate(FILMS), RenderPosition.BEFOREEND);

showFilmInfo();

// console.log(generateFilter(FILMS));
// console.log(FILMS);
// const watcher = (mutationList) => {
//   mutationList.forEach(mutation => {
//     mutation.addedNodes.forEach(addedNode => {
//       console.log(addedNode.classList.value);
//     })
//   });
// };

// const popupObserver = new MutationObserver(watcher);

// popupObserver.observe(document.body, {
//   childList: true,
// });
