const { bannedIds, allowedIds } = require('./ids');
const { updateFromDb } = require('./db');
const { reportError } = require('./error');
const { commands } = require('./commands');

function handleMessage(message) {
  if (!allowedIds.includes(message.author.id))
    return;

  if (!message.content.startsWith('..'))
    return;

  const cmd = message.content.replace('..', '');
  const args = cmd.split(' ');
  const [name] = args;
  for (const command of commands) {

    if (command.name !== name)
      continue;

    try {
      command.f(message, args);
    } catch (error) {
      reportError(error);
      message.channel.send(`${error}`);
    }

  }

}

function handleJoin(member, greetingsChannelId, kickBanned) {
  const channel = member.guild.channels.cache.find(ch => ch.id === greetingsChannelId);
  if (!channel)
    return;
  if (bannedIds.includes(member.id)) {
    kickBanned(channel, member);
  }
}

function handleReady() {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('I am ready!');
  console.log('Updating db index');
  updateFromDb(bannedIds);
}

module.exports = { handleMessage, handleJoin, handleReady };