import { getRandomInteger } from '../utils/common';
import { generateComment } from './comments';

export const generateRandomComments = () => {
  const newComments = [];
  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    newComments.push(generateComment());
  }

  return newComments;
};

export const generateContent = (contentArray) => {

  const randomIndex = getRandomInteger(0, contentArray.length - 1);

  return contentArray[randomIndex];
};
