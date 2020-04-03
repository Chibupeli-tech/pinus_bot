const {hookConsoleLog, unhookConsoleLog} = require('./testUtils');
// hide init logs from jest 
hookConsoleLog([]);
const { makeCommandsObject } = require('../src/commands/index');
test('Properly loads commands', () =>{
  const consoleOut = [];
  hookConsoleLog(consoleOut);

  makeCommandsObject(__dirname + '/mockCommands');

  unhookConsoleLog();
  
  expect(consoleOut).toEqual([
    [ 'Ignoring module badExports.js, no commands found' ],
    [ 'Ignoring module badModule.js, no commands found' ],
    [ 'Loading module good.js, found 1 command(s)' ],
    [ 'Loading module multipleCommands.js, found 5 command(s)' ]
  ]);
});