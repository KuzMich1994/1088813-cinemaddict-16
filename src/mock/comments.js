import { authors, commentContent, datesOfComment, smiles } from './data';
import { generateContent } from '../utils';

export const generateComment = () => ({
  id: 1,
  author: generateContent(authors),
  commentMessage: generateContent(commentContent),
  emotion: generateContent(smiles),
  date: generateContent(datesOfComment),
});
