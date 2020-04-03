jest.mock('axios');
jest.mock('../src/error')
const axios = require('axios');
const { bannedIds } = require('../src/ids');

let error = require('../src/error');
error.reportError = (...args) => console.log(...args);
const res = {
  "jsonrpc": "2.0",
  "id": 0,
  "result": [
    {
      id: 0,
      discord_id: '12312332131',
    },
    {
      id: 1,
      discord_id: '23423443232',
    }
  ]
};
axios.post.mockResolvedValue({ data: res });

const db = require('../src/db');

// If this if working all the db stuff is fine...
test('Properly update ids form db', () => {
  db.updateFromDb().then(() => {
    expect(bannedIds)
      .toEqual(['12312332131', '23423443232']);
  });
});

