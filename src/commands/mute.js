const { idFromMention, parseTime } = require('../utils');
const { reportError } = require('../error');
const muteMap = new Map();
function createMuteFn(member) {
  return () => {
    const { voice } = member;
    if (voice.channel) {
      voice.kick();
    }
  }
}
module.exports = {
  commands: [
    {
      name: 'mute',
      f: (message, args) => {
        const [cName, mention, time] = args;
        console.log(args);
        const id = idFromMention(mention);
        if (!id) {
          message.reply('Invald memeber');
          return;
        }
        const muteTime = parseTime(time);
        console.log({muteTime});
        if (muteTime < 0 || Number.isNaN(muteTime)) {
          message.reply('Invalid time');
          return;
        }
        message.guild.members.fetch(id).then((member) => {
          const checker = setInterval(createMuteFn(member), 5000);
          const timeout = setTimeout(() => {
            clearInterval(checker)
          }, muteTime);
          muteMap.set(message.guild.id + id, {
            checker,
            timeout
          });
          message.reply(`Muted ${id} for ${muteTime / 1000}s`);
        }).catch((err) => {
          message.reply('Cant find memeber');
          reportError(err);
        });
      }
    },
    {
      name: 'unmute',
      f: (message, args) => {
        const [cName, mention] = args;
        const id = idFromMention(mention);
        if (!id) {
          message.reply('Invald memeber');
          return;
        }
        const { checker, timeout } = muteMap.get(message.guild.id + id);
        clearInterval(checker);
        clearTimeout(timeout);
        muteMap.set(message.guild.id + id, {});
        message.reply(`Unmuted ${id}`);
      }
    }
  ]
}