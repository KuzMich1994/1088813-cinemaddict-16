import { releases, descriptions, names, posters, genre, directors, actors, runtimes } from './data';
import { getRandomInteger, getRandomNumber} from '../utils/common';
import { generateContent, generateRandomComments } from './random-content';


export const generateFilm = () => ({
  id: getRandomInteger(0, 1000),
  name: generateContent(names),
  description: generateContent(descriptions),
  poster: generateContent(posters),
  release: generateContent(releases),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  isWatchList: Boolean(getRandomInteger(0, 1)),
  isAlreadyWatched: Boolean(getRandomInteger(0, 1)),
  director: generateContent(directors),
  actor: generateContent(actors),
  writers: generateContent(actors),
  runtime: generateContent(runtimes),
  rating: getRandomNumber(1, 10),
  genre: generateContent(genre),
  comments: generateRandomComments().map((comment) => comment.id),
});


