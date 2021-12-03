import { getRandomInteger } from './common';

export const generateContent = (contentArray) => {

  const randomIndex = getRandomInteger(0, contentArray.length - 1);

  return contentArray[randomIndex];
};
