import HeaderProfileView from './view/header-profile-view';
import { RenderPosition, render } from './utils/render';
import {AUTHORIZATION, END_POINT} from './const';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';
import ApiService from './api-service';

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION));

render(header, new HeaderProfileView(), RenderPosition.BEFOREEND);

const filmsPresenter = new FilmsListPresenter(main, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(main, filterModel, filmsModel);

filmsPresenter.init();
filterPresenter.init();
filmsModel.init();
