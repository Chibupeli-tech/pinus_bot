const { bannedIds } = require('./ids');

function updateFromDb() {
    bannedIds.push(...['318834208741261312', '594919505956700170']);
    console.log('db is deprecated');
}

function addToDb(id) {
  console.log('db is deprecated');

  return;
}
module.exports = { updateFromDb, addToDb };