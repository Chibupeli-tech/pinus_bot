const { reportError } = require('../error');
const nicknameMap = new Map();

module.exports = {
  commands: [{
    name: 'sadmoment',
    f: (message, args) => {
      const { ownerID } = message.guild;
      message.guild.members.fetch().then((members) => {
        members.forEach(member => {
          const { user, nickname } = member;
          nicknameMap.set(user.id, nickname);
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
          const oldNickname = nicknameMap.get(user.id);
          member.setNickname(oldNickname)
            .catch((err) => { reportError(err); });
        });
        message.channel.send(`Done!`);
      });
    }
  }
  ]
};