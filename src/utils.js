const { setupMaster } = require('cluster');

const MS = 1;
const SECOND = 1000 * MS;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

function sha256sum(path) {
  const crypto = require('crypto');
  const fs = require('fs');
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(path));
  return hash.digest('hex');    
}

function fromCharCodeArray(arr) {
  return arr.reduce((acc, cv) => acc + String.fromCharCode(cv), '');
}
const timeStrRegex = /(\d*)(h|min|s)/;
function isParsableTime(str) {
  return timeStrRegex.test(str)
}
function parseTime(timeString) {
  const [fullMatch, digit, units] = timeStrRegex.exec(timeString);
  const intVal = parseInt(digit, 10);
  switch (units) {
    case 'h':
      return intVal * HOUR;
    case 'min':
      return intVal * MINUTE;
    case 's':
      return intVal * SECOND;
    default:
      throw new Error('Cant parse time');
      break;
  }
}

function idFromMention(mention) {
  const regex = /<@\!(\d*)>/gm;
  let r;
  if((r = regex.exec(mention)) !== null){
    return r[1];
  }
}

module.exports = {fromCharCodeArray, parseTime, isParsableTime, idFromMention, sha256sum};