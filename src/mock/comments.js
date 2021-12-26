import { authors, commentContent, datesOfComment, smiles } from './data';
import { generateContent } from './random-content';
import {nanoid} from 'nanoid';

export const generateComment = () => ({
  id: nanoid(),
  author: generateContent(authors),
  commentMessage: generateContent(commentContent),
  emotion: generateContent(smiles),
  date: generateContent(datesOfComment),
});
