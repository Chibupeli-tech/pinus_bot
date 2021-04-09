const { bannedIds: pashas_ids } = require('../ids');
const { addToDb } = require('../db');
import { UserConfig } from '../ids';
function findPasha() {
  const list = client.guilds.cache.get(tgt_server);
  const found = list.members.cache.find(member => {
    if (pashas_ids.includes(member.user.id)) {
      return member;
    }
  });
  if (!found) {
    throw new Error('No matches');
  }
  return found;
}


let delayed = 0;
function kickPasha(channel, member, ttl = null) {
  let kickTimeout = Math.floor(Math.random() * 100);
  if (ttl !== null) {
    kickTimeout = ttl + 1;
  }
  channel.send(`${member}, Паша иди нахуй\n Тебе жить осталось ${kickTimeout} c.\nhttps://cdn.discordapp.com/attachments/422309477132402690/694541220923572254/unknown.png`);
  delayed = setTimeout(() => {
    member.kick('Russki');
  }, kickTimeout * 1000);
}

async function logPasha(msg) {
  const banned = UserConfig.getInstance().getBanned()
  try {
    const all = [];
    for (b of banned) {
      const x = client.users.fetch(b).then(e => e).catch(e => console.error('piiiiiiiiiiiiiiiiiizda'));
      all.push(x);
    }
    msg.channel.send(`All known accounts: ${all.join(' ')}`);
    return;
  }
  catch (e) {
    msg.channel.send('Error fetching user data');
    return;
  }
}


const commands = [
  {
    name: 'addpasha',
    f: function (message, args) {
      const id = args[1];

      if (!(parseInt(id, 10) > 0))
        throw new Error('Invalid id');
      UserConfig.getInstance(message.guild.id).addBanned(id);

      message.channel.send(`Id added`);

      //addToDb(id);

      logPasha(message);
      message.channel.send(`Running retard check...`);
      const member = findPasha();
      kickPasha(message.channel, member);
    }
  },
  {
    name: 'listpasha',
    f: function (message, args) {
      logPasha(message);
    }
  },
  {
    name: 'skip',
    f: function (message, args) {
      clearTimeout(delayed);
      const member = findPasha();
      kickPasha(message.channel, member, 0);
    }
  }
];

module.exports = {
  kickPasha,
  findPasha,
  logPasha,
  commands
}