const config = require('../../config');
module.exports = {
  commands:
    [
      {
        name: 'status',
        f: (message, args) => {
          const [_] = args;
          const text = 
          [
            `FeelsGood`,
            `AppId: \`${config.HEROKU_APP_ID}\``,
            `Deployed at: ${new Date(config.HEROKU_RELEASE_CREATED_AT)}`,
            `Commit: \`${config.HEROKU_SLUG_COMMIT.slice(0,16)}\``,
          ].join('\n');

          message.channel.send(text);
        }
      },
    ]
};