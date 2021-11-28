export const createFilmsCounterTemplate = (getAllFilms) => (
  `
    <p>${getAllFilms.length} movies inside</p>
  `
);
