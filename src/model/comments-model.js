import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async (filmId) => {
    try {
      const comments = await this.#apiService.getComments(filmId);
      this.#comments = comments.map(this.#adaptToClient);
    } catch (err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  }

  get comments() {
    return this.#comments;
  }

  addComment = async (updateType, update, filmId) => {
    try {
      await this.#apiService.addComment(update, filmId);
      const comments = await this.#apiService.getComments(filmId);
      this.#comments = comments.map(this.#adaptToClient);

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }

  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t remove unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {
      ...comment,
      commentMessage: comment['comment'],
    };

    delete adaptedComment['comment'];

    return adaptedComment;
  }
}
