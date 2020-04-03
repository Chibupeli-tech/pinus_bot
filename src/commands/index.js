const fs = require('fs');
function makeCommandsObject(dir) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .map(file => {
      try {
        return {file, module: require(`${dir}/${file}`)}
      } catch(error) {
        // If you fuck up dir listing it happens
        console.log(`Could not find ${file}`);
        return {file, module: {}};
      }
    })
    .filter(e => {
      const {file, module} = e;
      if (!(module.command || module.commands)){
        console.log(`Ignoring module ${file}, no commands found`);
        return false;
      } else {
        console.log(`Loading module ${file}, found ${(module.command || module.commands).length||1} command(s)`);
        return true;
      }
    })
    .flatMap(e => e.module.command || e.module.commands);
}
const commands = makeCommandsObject(__dirname);
module.exports = {commands, makeCommandsObject};