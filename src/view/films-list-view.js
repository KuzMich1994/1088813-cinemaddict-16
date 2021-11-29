export const createFilmsListTemplate = (extraClass) => (
  `<section class="films-list ${extraClass ? extraClass : ''}">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>`
);