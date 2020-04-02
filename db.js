const axios = require('axios');

const config = require('./config');
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

module.exports = { request };