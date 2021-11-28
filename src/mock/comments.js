import { authors, commentContent, datesOfComment, smiles } from '../const';
import { generateContent } from '../utils';

export const generateComment = () => ({
  id: 1,
  author: generateContent(authors),
  commentMessage: generateContent(commentContent),
  emotion: generateContent(smiles),
  date: generateContent(datesOfComment),
});
