const Discord = require('discord.js');
const config = require('./config');
const dbRequest = require('./db').request;
const client = new Discord.Client();

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
  client.users.fetch(owner_id).then(u => u.send('```' + err + '```'));
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

function updateFromDb() {
  dbRequest('SELECT * from `pinus`;').then(data => {
    // Clear id's array
    // xD
    Array(3).fill(0).forEach(() => { pashas_ids.pop() });
    pashas_ids.push(...data.map(({ discord_id }) => discord_id));
    console.log('Id index updated...');
  }).catch(err => {
    throw err
  });
}
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('I am ready!');
  console.log('Updating db index');
  try {
    updateFromDb()
  } catch (error) {
    // Securign failsafe
    pashas_ids.push(...['318834208741261312', '594919505956700170']);
    reportError(error.stack);
  }
});

const commands = [
  {
    name: 'addpasha',
    f: function (message, args) {
      const id = args[1];

      if (!(parseInt(id, 10) > 0))
        throw new Error('Invalid id');

      pashas_ids.push(id);
      message.channel.send(`Id added`);

      dbRequest(`INSERT INTO \`pinus\` (\`id\`, \`discord_id\`) VALUES (NULL, '${id}');`)
      .then(() => { })
      .catch((err) => { reportError(err.stack) });

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

client.on('message', message => {
  if (allowedIds.includes(message.author.id)) {
    if (message.content.startsWith('..')) {
      const cmd = message.content.replace('..', '');
      const args = cmd.split(' ');
      const [name] = args;
      console.log({ name, cmd, args });
      for (const command of commands) {
        if (command.name === name) {
          try {
            command.f(message, args);
          } catch (error) {
            reportError(error.stack);
            message.channel.send(`${error}`);
          }
        }
      }
    }
  }
});
// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  const tgt_channel = '422309477132402690';
  const channel = member.guild.channels.cache.find(ch => ch.id === tgt_channel);
  if (!channel) return;
  if (pashas_ids.includes(member.id)) {
    kickPasha(channel, member);
  }
});
client.login(config.BOT_TOKEN);

