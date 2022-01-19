import HeaderProfileView from './view/header-profile-view';
import { RenderPosition, render } from './utils/render';
import FilmsCounterView from './view/films-counter-view';
import { generateFilm } from './mock/film';
import { FILMS_LIST_COUNTER } from './const';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';
import ApiService from './api-service';

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStatistics = footer.querySelector('.footer__statistics');

const AUTHORIZATION = 'Basic ui312gco2n835cy27q5y';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const getAllFilms = () => {
  const filmsList = [];
  for (let i = 0; i < FILMS_LIST_COUNTER; i++) {
    filmsList.push(generateFilm());
  }
  return filmsList;
};
const filmsFixture = getAllFilms();

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));

filmsModel.films = filmsFixture;

const filterModel = new FilterModel();

const commentsModel = new CommentsModel();

render(header, new HeaderProfileView(), RenderPosition.BEFOREEND);
render(footerStatistics, new FilmsCounterView(filmsFixture), RenderPosition.BEFOREEND);

const filmsPresenter = new FilmsListPresenter(main, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(main, filterModel, filmsModel);

filmsPresenter.init();
filterPresenter.init();
