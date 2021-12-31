import HeaderProfileView from './view/header-profile-view';
import { RenderPosition, render } from './utils/render';
import FilmsCounterView from './view/films-counter-view';
import { generateFilm } from './mock/film';
import { FILMS_LIST_COUNTER } from './const';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmsModel from './model/films-model';

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

const filmsModel = new FilmsModel();

filmsModel.films = filmsFixture;

render(header, new HeaderProfileView(), RenderPosition.BEFOREEND);
render(footerStatistics, new FilmsCounterView(filmsFixture), RenderPosition.BEFOREEND);

const filmsPresenter = new FilmsListPresenter(main, filmsModel);

filmsPresenter.init();
