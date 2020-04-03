const axios = require('axios');

const config = require('../config');
const { bannedIds } = require('./ids');
const { reportError } = require('./error');
const req = (q) => ({
  jsonrpc: '2.0',
  id: 0,
  method: 'sql',
  params: {
    auth: { "user": config.DB_USER, "pass": config.DB_PASS },
    db: config.DB_NAME,
    query: q
  }
});

function request(query) {
  return axios.post(config.DB_URL, req(query))
    .then(res => {
      if (res.data) {
        if ('error' in res.data) {
          throw new Error(res.data.error.message);
        }
        else {
          return res.data.result
        }
      }
    })
    .catch(error => {
      throw error
    });
}

function updateFromDb() {
  return request('SELECT * from `pinus`;').then(data => {
    // Clear id's array
    // xD
    Array(bannedIds.length).fill(0).forEach(() => { bannedIds.pop() });
    bannedIds.push(...data.map(({ discord_id }) => discord_id));
    console.log('Id index updated!');
  }).catch(err => {
    bannedIds.push(...['318834208741261312', '594919505956700170']);
    console.log('Id index update failed.');
    reportError(err);
  });
}
function addToDb(id) {
  request(`INSERT INTO \`pinus\` (\`id\`, \`discord_id\`) VALUES (NULL, '${id}');`)
    .then(() => { })
    .catch((err) => { reportError(err) });
}
module.exports = { request, updateFromDb, addToDb };