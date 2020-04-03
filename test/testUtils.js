const { bannedIds, allowedIds } = require('../src/ids');
const commandManager = require('../src/commands');
const error = require('../src/error');
const oConsoleLog = console.log;

const hookConsoleLog = (out) => {
  console.log = (...args) => out.push(args);
}
const unhookConsoleLog = () => {
  console.log = oConsoleLog;
}
const setBannedIds = (x) => {
  Array(bannedIds.length).fill(0).forEach(() => bannedIds.pop());
  bannedIds.push(...x);
};

const setAllowedIds = (x) => {
  Array(allowedIds.length).fill(0).forEach(() => bannedIds.pop());
  allowedIds.push(...x);
};
const setCommands = (x) => {
  commandManager.commands = x;
}
const setReportError = (x)  => {
  error.reportError = x;
}
module.exports = {
  oConsoleLog,
  unhookConsoleLog,
  hookConsoleLog,
  setBannedIds,
  setAllowedIds,
  setCommands,
  setReportError
};
