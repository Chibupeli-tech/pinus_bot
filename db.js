const axios = require('axios');
const req = (q) => ({
  jsonrpc: '2.0',
  id: 0,
  method: 'sql',
  params: {
    auth: { "user": "", "pass": "" },
    db: '',
    query: q
  }
});

function request(query) {
  return axios.post('', req(query))
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