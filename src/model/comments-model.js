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

  addComment = (updateType, update) => {
    this.#comments = [
      ...this.#comments,
      update,
    ];

    this._notify(updateType, this.#comments);
  }

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t remove unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
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
