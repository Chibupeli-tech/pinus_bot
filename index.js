const Discord = require('discord.js');

const config = require('./config');
const {GuildDb} = require('./src/lib/GuildDb');
global.client = new Discord.Client();
const handlers = require('./src/handlers');
const { kickPasha } = require('./src/commands/pasha');
client.on('ready', async () => {
  handlers.handleReady();
  console.log(GuildDb);
  await GuildDb.getInstance().init(client.guilds);
  GuildDb.getInstance().setValue('694527517155131402', {asdfasdf: 2});
  GuildDb.getInstance().getValue('694527517155131402', 'asdfasdf')
});

client.on('message', message => {
  handlers.handleMessage(message);
});

client.on('guildMemberAdd', member => {
  // TODO: varible greetings channel
  handlers.handleJoin(member, '422309477132402690', kickPasha);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
})
client.login(config.BOT_TOKEN);

