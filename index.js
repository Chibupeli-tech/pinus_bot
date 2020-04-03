const Discord = require('discord.js');

const config = require('./config');

global.client = new Discord.Client();
const handlers = require('./src/handlers');
const { kickPasha } = require('./commands/pasha');
const { commands } = require('./commands');


client.on('ready', () => {
  handlers.handleReady();
});

client.on('message', message => {
  handlers.handleMessage(message);
});

client.on('guildMemberAdd', member => {
  // TODO: varible greetings channel
  handlers.handleJoin(member, '422309477132402690', kickPasha);
});

client.login(config.BOT_TOKEN);

