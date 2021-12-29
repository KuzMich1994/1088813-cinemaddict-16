export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomNumber = (a = 0, b = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.floor(Math.max(a, b));
  const number = (lower + Math.random() * (upper - lower + 1));

  if (number >= b) {
    return Math.floor(number);
  }

  return number.toFixed(1);
};

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins/60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
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

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

