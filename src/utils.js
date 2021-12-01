import { generateComment } from './mock/comments';

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

export const generateContent = (contentArray) => {

  const randomIndex = getRandomInteger(0, contentArray.length - 1);

  return contentArray[randomIndex];
};

export const generateRandomComments = () => {
  const newComments = [];
  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    newComments.push(generateComment());
  }

  return newComments;
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

  return newElement.firstChild;
};
