const { reportError } = require('../error');
const { parseTime, isParsableTime, idFromMention } = require('../utils');

function parseArgs(args) {
  const [_, ...rest] = args;
  const idList = [];
  let expectingComma = false;
  for (let i = 0; i < rest.length; i++) {
    const el = rest.shift();
    
    if (idFromMention(el)) {
      idList.push(idFromMention(el));
      expectingComma = true;
      continue;
    }
    if (el === ',') {
      expectingComma = false;
      continue;
    }
    
    if (expectingComma) {
      rest.unshift(el);
      break;
    }
  }
  console.log({rest});
  const regexes = [];
  let timeFrame;
  for (const token of rest) {
    if (token.startsWith('`') && token.endsWith('`')) {
      regexes.push(
        new RegExp(
          token.replace(/`/gm, ''), 'gm'
        )
      );
    }
    if (isParsableTime(token)) {
      timeFrame = parseTime(token);
    }
  }
  console.log({ idList, regexes, timeFrame });
  return { idList, regexes, timeFrame };
}

module.exports = {
  commands: [
    {
      name: 'rm',
      f: (message, args) => {
        const {idList, regexes,timeFrame} = parseArgs(args);
        if (!idList) {
          throw new Error('No id supplied');
        }
        if (!regexes) {
          throw new Error('No regex');
        }
        if (!timeFrame) {
          throw new Error('No time frame given');
        }
        message.channel.messages.fetch().then((res) => {
          res.forEach(msg => {
            //
            const now = new Date().getTime();
            const then = msg.createdAt.getTime();
            const delta = now - then;
            // Not in the time frame
            if (delta > timeFrame)
              return;

            if (!idList.includes(msg.author.id))
              return;

            for (const regex of regexes) {

              if (!msg.deletable)
                return;

              if (regex.test(msg.content))
                msg.delete()
                  .then()
                  .catch(reportError);
            }
          });
        })
        .catch(reportError);
      }
    }
  ]
};