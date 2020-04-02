const { ownerId } = require('./ids');

function reportError(err) {
  client.users.fetch(ownerId).then(u => u.send('```' + err.stack + '```'));
}

module.exports = { reportError };