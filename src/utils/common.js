import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);


export const getTimeFromMins = (mins, settings = { minutesOnly: false, hoursOnly: false }) => {
  const hours = Math.trunc(mins/60);
  const minutes = mins % 60;

  if (!settings.minutesOnly && !settings.hoursOnly) {
    return `${hours}h ${minutes}m`;
  } else if (settings.minutesOnly) {
    return isNaN(minutes) ? 0 : minutes;
  } else {
    return isFinite(hours) ? hours : 0;
  }
};


export const addElipsis = (textContent, counter) => {
  let filteredTextContent = textContent ? textContent : '';

  if (filteredTextContent.length > counter) {
    filteredTextContent = `${filteredTextContent.substring(0, counter)  }...`;
  }

  return filteredTextContent;
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const getProfileRank = (filmsCount) => {
  let profileName;

  if (filmsCount >= 1 && filmsCount < 11) {
    profileName = 'novice';
  } else if (filmsCount >= 11 && filmsCount < 21) {
    profileName = 'fan';
  } else if (filmsCount >= 21) {
    profileName = 'movie buff';
  }

  return profileName;
};

export const isBetweenDate = (watchingDate, statisticPeriod) => {
  if (statisticPeriod === 'today') {
    return dayjs(watchingDate).isBetween(dayjs(new Date()), dayjs().startOf('day'));
  }

  const startingPoint = dayjs(new Date()).subtract(1, statisticPeriod).format();

  return dayjs(watchingDate).isBetween(dayjs(new Date()), startingPoint);
};

export const getChartData = (films) => films.map((film) => film.genre)
  .flat()
  .reduce((previousValue, currentValue) => {
    if (previousValue[currentValue] === undefined) {
      previousValue[currentValue] = 1;
    } else {
      previousValue[currentValue] = previousValue[currentValue] + 1;
    }
    return previousValue;
  }, {});

export const getTopGenre = (chartData) => {
  const values = Object.values(chartData);
  const keys = Object.keys(chartData);

  let data = 0;
  let topGenreIndex = 0;

  values.forEach((value, index) => {
    if (value > data) {
      data = value;
      topGenreIndex = index;
    }
  });

  return keys[topGenreIndex];
};
