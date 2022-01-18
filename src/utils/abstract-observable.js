export default class AbstractObservable {
  #observables = new Set();

  addObserver(observer) {
    this.#observables.add(observer);
  }

  removeObserver(observer) {
    this.#observables.delete(observer);
  }

  _notify(event, payload) {
    this.#observables.forEach((observer) => observer(event, payload));
  }
}
