import FilmsListPresenter from './films-list-presenter';
import FilterPresenter from './filter-presenter';
import NavigationView from '../view/navigation-view';
import {remove, render, RenderPosition} from '../utils/render';
import StatisticsView from '../view/statistics-view';

export default class MainPresenter {
  #filmsListPresenter = null;
  #filtersPresenter = null;
  #filmsModel = null;
  #filtersModel = null;
  #commentsModel = null;

  #navigationComponent = new NavigationView();
  #statisticsComponent = null;

  #mainContainer = document.querySelector('.main');

  constructor({
    filmsModel,
    filtersModel,
    commentsModel,
  }) {
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;
    this.#commentsModel = commentsModel;
    this.#filmsListPresenter = new FilmsListPresenter(this.#mainContainer, this.#filmsModel, this.#filtersModel, this.#commentsModel);
    this.#filtersPresenter = new FilterPresenter({
      navigationComponent: this.#navigationComponent,
      filterModel: this.#filtersModel,
      filmsModel: this.#filmsModel,
      filmsPresenter: this.#filmsListPresenter,
      removeStatistics: this.#removeStatistics,
    });
  }

  init = () => {
    this.#renderNavigation();
    this.#filmsListPresenter.init();
    this.#filtersPresenter.init();
  }

  #renderNavigation = () => {
    this.#navigationComponent.setStatisticsClickHandler(this.#statisticsClickHandler);
    render(this.#mainContainer, this.#navigationComponent, RenderPosition.BEFOREEND);
  }

  #statisticsClickHandler = () => {
    this.#filmsListPresenter.destroy();
    this.#renderStatistics();
  }

  #renderStatistics = () => {
    this.#statisticsComponent = new StatisticsView(this.#filmsModel.films);
    this.#statisticsComponent.setChoiceStatisticPeriodHandler();
    render(this.#mainContainer, this.#statisticsComponent, RenderPosition.BEFOREEND);
  }

  #removeStatistics = () => {
    remove(this.#statisticsComponent);
    this.#statisticsComponent = null;
  }
}
