import ComponentView from './component-view';
import {getProfileRank} from '../utils/common';

const createHeaderProfileTemplate = (historyFilmsCount) => (
  `<section class="header__profile profile">
    ${historyFilmsCount > 0 ? `<p class="profile__rating">${getProfileRank(historyFilmsCount)}</p>` : ''}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);
export default class HeaderProfileView extends ComponentView {
  #historyFilmsCount = null;

  constructor(historyFilmsCount) {
    super();

    this.#historyFilmsCount = historyFilmsCount;
  }

  get template() {
    return createHeaderProfileTemplate(this.#historyFilmsCount);
  }
}
