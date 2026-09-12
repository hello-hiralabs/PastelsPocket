/* Urutan modul, topologis: yang di atas tidak boleh bergantung
   pada yang di bawah. Dipakai oleh rewire.mjs dan build.mjs. */
export const ORDER = [
  'src/i18n.js','src/constants.js','src/utils.js','src/state.js','src/data-service.js',
  'src/calc.js','src/rewards.js','src/recurring.js','src/csv.js','src/filter.js',
  'src/fx.js','src/sheet.js','src/mascot.js','src/history.js',
  'src/views/header.js','src/views/home.js','src/views/goals.js','src/views/badges.js','src/views/recap.js',
  'src/sheets.js','src/story.js','src/render.js','src/actions.js','src/app.js'
];
