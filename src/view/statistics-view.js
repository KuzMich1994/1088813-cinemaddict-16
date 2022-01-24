import SmartView from './smart-view';
import {getChartData, getProfileRank, getTimeFromMins, getTopGenre, isBetweenDate} from '../utils/common';
import {filter} from '../utils/filter';
import {FilterType, START_STATISTIC_PERIOD, StatisticsRadioButtons} from '../const';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const createStatisticsTemplate = (films, statisticPeriod, topGenre) => {

  const createRadioButtonsTemplate = (button) => (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${button.type}" value="${button.type}" ${statisticPeriod === button.type ? 'checked' : ''} >
   <label for="statistic-${button.type}" class="statistic__filters-label">${button.name}</label>`
  );

  const runtimes = films.map((film) => film.runtime);
  const totalHours = getTimeFromMins(Math.max(...runtimes, ...runtimes), {hoursOnly: true});
  const totalMinutes = getTimeFromMins(Math.max(...runtimes, ...runtimes), {minutesOnly: true});
  const radioButtonTemplate = StatisticsRadioButtons.map((button) => createRadioButtonsTemplate(button)).join('');

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${films.length === 0 ? '' : `${getProfileRank(films.length)}`}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        ${radioButtonTemplate}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${films.length > 0 ? films.length : 0} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalHours} <span class="statistic__item-description">h</span> ${totalMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre ? topGenre : 'No top genre'}</p>
        </li>
      </ul>

      ${films.length > 0 ? `
        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>
      ` : ''}

  </section>`
  );
};

const createChartElement = (statisticsCtx, chartData) => {
  const BAR_HEIGHT = 50;
  statisticsCtx.height = BAR_HEIGHT * 5;

  new Chart(statisticsCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: Object.keys(chartData),
      datasets: [{
        data: Object.values(chartData),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

};

export default class StatisticsView extends SmartView {
  #films = null;
  #filterFilms = null;
  #statisticPeriod = START_STATISTIC_PERIOD;
  #chartData = null;
  #topGenre = null;

  constructor(films) {
    super();

    this.#films = filter[FilterType.HISTORY](films);

    this.#getData();

    this.#setCharts();
    this.restoreHandlers();
  }

  get template() {
    return createStatisticsTemplate(this.#filterFilms, this.#statisticPeriod, this.#topGenre);
  }

  setChoiceStatisticPeriodHandler = () => {
    this.element.querySelector('.statistic__filters').addEventListener('click', this.#choiceStatisticPeriodHandler);
  }

  restoreHandlers = () => {
    this.setChoiceStatisticPeriodHandler();
    this.#setCharts();
  }

  #choiceStatisticPeriodHandler = (e) => {
    const target = e.target;

    if (target.matches('.statistic__filters-label')) {
      this.#statisticPeriod = target.previousElementSibling.value;
      this.#getData();
      this.updateData(this.#filterFilms);
    }
  }

  #setCharts = () => {
    const statisticsCtx = this.element.querySelector('.statistic__chart');
    if (statisticsCtx) {
      createChartElement(statisticsCtx, this.#chartData);
    }
  }

  #getData = () => {
    if (this.#statisticPeriod !== START_STATISTIC_PERIOD) {
      this.#filterFilms = this.#films.filter((film) => isBetweenDate(film.watchingDate, this.#statisticPeriod));
    } else {
      this.#filterFilms = this.#films;
    }

    this.#chartData = getChartData(this.#filterFilms);
    this.#topGenre = getTopGenre(this.#chartData);
  }
}
