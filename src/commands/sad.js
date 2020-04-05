const nicknameMap = new Map();

module.exports = {
  commands: [{
    name: 'sadmoment',
    f: (message, args) => {
      const {ownerID} = message.guild;
      message.guild.members.fetch().then((members) => {
        members.forEach(member => {
          const { user, nickname } = member;
          nicknameMap.set(user.id, nickname);
          if (user.id === ownerID) 
            return;
          member.setNickname('🥺')
            .then(mmbr => { console.log(mmbr.nickname) })
            .catch((err) => { console.log(err);});
          console.log(user.id, nickname);
        });
        console.log(nicknameMap);
      });
    }
  },
  {
    name: 'undosad',
    f: (message, args) => {
      const {ownerID} = message.guild;
      console.log('Fetching members')
      message.guild.members.fetch().then((members) => {
        members.forEach(member => {
          const { user } = member;
          if (user.id === ownerID) 
            return;
          const oldNickname = nicknameMap.get(user.id);
          member.setNickname(oldNickname)
            .catch((err) => { console.log(err) });
        });
      });
    }
  }
  ]
};