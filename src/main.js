import {AUTHORIZATION, END_POINT} from './const';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';
import ApiService from './api-service';

const main = document.querySelector('.main');

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel(apiService);

const filterModel = new FilterModel();

const commentsModel = new CommentsModel(apiService);

const filmsPresenter = new FilmsListPresenter(main, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(main, filterModel, filmsModel);

filmsPresenter.init();
filterPresenter.init();
filmsModel.init();
