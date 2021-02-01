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
    bannedIds.push(...['318834208741261312', '594919505956700170']);
    console.log('db is deprecated');
}

function addToDb(id) {
  console.log('db is deprecated');

  return;
}
module.exports = { request, updateFromDb, addToDb };