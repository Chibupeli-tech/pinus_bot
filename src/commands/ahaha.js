const { idFromMention, parseTime } = require('../utils');
function loop(message, id, interval) {
  const destTime = new Date().getTime() + interval;

  const runner = () => setTimeout(() => {
    message.channel.send(`<@!${id}>`)
      .then(msg => msg.delete({ timeout: 10000 }));
    
    if (new Date().getTime() >= destTime) {
      return;
    }
    
    runner();
  }, 5000);
  runner();
}

module.exports = {
  commands: [
    {
      name: 'ahaha',
      f: (message, args) => {
        const [_, mention, time] = args;
        console.log(args);
        const id = idFromMention(mention);

        if (!id) {
          message.reply('Invald memeber');
          return;
        }
        
        const interval = parseTime(time);
        console.log(interval)
        if (interval < 0 || Number.isNaN(interval)) {
          message.reply('Invalid interval time');
          return;
        }

        loop(message, id, interval);
      }
    }
  ]
}