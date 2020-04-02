const Discord = require('discord.js');

const config = require('./config');
const {updateFromDb, addToDb} = require('./src/db');

global.client = new Discord.Client();
const handlers = require('./src/handlers');

const owner_id = '258680327906525184';
const pashas_ids = ['318834208741261312', '594919505956700170'];
// Sanya, Ya
const allowedIds = ['359336905185165322', owner_id];
// *This* server
const tgt_server = '422309477132402688';

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

function reportError(err) {
  client.users.fetch(owner_id).then(u => u.send('```' + err.stack + '```'));
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

function logPasha(msg) {
  Promise.all(
    pashas_ids.map(p => client.users.fetch(p))
  ).then(
    (r) => msg.channel.send(`All known accounts: ${r.join(' ')}`)
  );
}


const commands = [
  {
    name: 'addpasha',
    f: function (message, args) {
      const id = args[1];

      if (!(parseInt(id, 10) > 0))
        throw new Error('Invalid id');

      pashas_ids.push(id);
      message.channel.send(`Id added`);
      
      addToDb(id, reportError);
      
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


client.on('ready', () => {
  handlers.handleReady();
});

client.on('message', message => {
  handlers.handleMessage(message, allowedIds, commands, reportError);
});

client.on('guildMemberAdd', member => {
  // TODO: varible greetings channel
  handlers.handleJoin(member, '422309477132402690', pashas_ids, kickPasha);
});

client.login(config.BOT_TOKEN);

