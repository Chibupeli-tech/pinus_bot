const Discord = require('discord.js');

const config = require('./config');
const {GuildDb} = require('./src/lib/GuildDb');
global.client = new Discord.Client();
const handlers = require('./src/handlers');
const { kickPasha } = require('./src/commands/pasha');
client.on('ready', () => {
  handlers.handleReady();
  console.log(GuildDb);
  GuildDb.getInstance().init(client.guilds);
  GuildDb.getInstance().setValue('694527517155131402', {asdfasdf: 2});
  GuildDb.getInstance().getValue('694527517155131402', 'asdfasdf').then(e => console.log(e))
});

client.on('message', message => {
  handlers.handleMessage(message);
});

client.on('guildMemberAdd', member => {
  // TODO: varible greetings channel
  handlers.handleJoin(member, '422309477132402690', kickPasha);
});

client.login(config.BOT_TOKEN);

