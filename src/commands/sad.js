const ytdl = require('ytdl-core');
const { reportError } = require('../error');
const nicknameMap = new Map();

function playYTsong(url, message) {
  if (message.member.voice.channel) {
    message.member.voice.channel.join().then(conn => {
      const dispatcher = conn.play(ytdl(url, { filter: 'audioonly' }));
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
}

function forAllMemebersNotOwner(message, callback) {
  message.guild.members.fetch().then((members) => {
    const { ownerID } = message.guild;
    members.forEach(member => {
      if (member.user.id === ownerID)
        return;
      callback(member);
    });
  });
}

function setNicknameForAllMembers(message, newNickname) {
  forAllMemebersNotOwner(message, (member) => {
    const { user, nickname } = member;
    nicknameMap.set(user.id + message.guild.id, nickname);

    member.setNickname(newNickname)
      .catch((err) => { reportError(err); });
  });
}
function restoreNicnames(message) {
  forAllMemebersNotOwner(message, (member) => {
    const { user } = member;
    const oldNickname = nicknameMap.get(user.id + message.guild.id) || null;
    member.setNickname(oldNickname)
      .catch((err) => { reportError(err); });
  });
}

function fromCharCodeArray(arr){
  return arr.reduce((acc,cv) => acc+String.fromCharCode(cv), '');
}

module.exports = {
  commands: [{
    name: 'sadmoment',
    f: (message, args) => {
      playYTsong('https://www.youtube.com/watch?v=pgN-vvVVxMA', message);
      setNicknameForAllMembers(message, '🥺');
      message.channel.send('Done!');
    }
  },
  {
    name: 'undosad',
    f: (message, args) => {
      restoreNicnames(message);
      message.channel.send('Done!')
    }
  },
  {
    //ukraine flag emoji
    name: fromCharCodeArray([55356, 56826, 55356, 56806]),
    f: (message, args) => {
      playYTsong('https://www.youtube.com/watch?v=Y-O_SnccYfo', message);

      const uaFlag = fromCharCodeArray([55356, 56826, 55356, 56806]);
      setNicknameForAllMembers(message, uaFlag.repeat(3));
      message.channel.send('Done!')

    }
  }
  ]
};