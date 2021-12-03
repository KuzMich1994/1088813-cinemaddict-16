import { getRandomInteger } from './common';
import { generateComment } from '../mock/comments';

export const generateRandomComments = () => {
  const newComments = [];
  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    newComments.push(generateComment());
  }

  return newComments;
};
