const ytdl = require('ytdl-core');
const { reportError } = require('../error');
const nicknameMap = new Map();

module.exports = {
  commands: [{
    name: 'sadmoment',
    f: (message, args) => {
      const { ownerID } = message.guild;

      if (message.member.voice.channel) {
        message.member.voice.channel.join().then(conn => {
          const dispatcher = conn.play(ytdl('https://www.youtube.com/watch?v=pgN-vvVVxMA', { filter: 'audioonly' }));
          dispatcher.pause();
          dispatcher.resume();
          dispatcher.on('finish', () => {
            console.log('Finished playing!');
            dispatcher.destroy();
            conn.disconnect();
          });
        });
      } else {
        message.reply('You need to join a voice channel first!');
      }
      message.guild.members.fetch().then((members) => {
        members.forEach(member => {
          const { user, nickname } = member;
          nicknameMap.set(user.id + message.guild.id, nickname);
          if (user.id === ownerID)
            return;
          member.setNickname('🥺')
            .catch((err) => { reportError(err); });
        });
        message.channel.send(`Done!`);
      });
    }
  },
  {
    name: 'undosad',
    f: (message, args) => {
      const { ownerID } = message.guild;
      message.guild.members.fetch().then((members) => {
        members.forEach(member => {
          const { user } = member;
          if (user.id === ownerID)
            return;
          const oldNickname = nicknameMap.get(user.id + message.guild.id) || null;
          member.setNickname(oldNickname)
            .catch((err) => { reportError(err); });
        });
        message.channel.send(`Done!`);
      });
    }
  }
  ]
};