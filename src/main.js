import {AUTHORIZATION, END_POINT} from './const';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';
import ApiService from './api-service';
import MainPresenter from './presenter/main-presenter';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel(apiService);

const filterModel = new FilterModel();

const commentsModel = new CommentsModel(apiService);

const mainPresenter = new MainPresenter({
  filmsModel: filmsModel,
  filtersModel: filterModel,
  commentsModel: commentsModel,
});

mainPresenter.init();
filmsModel.init();


