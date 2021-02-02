const ytdl = require('ytdl-core');
const fs = require('fs');
const {join} = require('path');
const {exec} = require('child_process');

const { sha256sum } = require('../utils');
const { assert } = require('console');

const CRABRAVE_TEMPLATE_URL = 'https://www.youtube.com/watch?v=eByhYbBvNWk';
const VALID_TEMPLATE_HASH = 'c27ce3b68c9ae0f9f781a2b1d0e87ec30d4c4ead812fb0d9f2c978c99387cc93';

let msg;

async function getSourceClip() {
  const target_path = '/tmp/template.mp4';
  
  const download = () => 
    new Promise((resolve, reject) => {
      const write_stream = ytdl(
        CRABRAVE_TEMPLATE_URL,
        { filter: format => format.container === 'mp4' })
        .pipe(fs.createWriteStream(target_path));
        
      write_stream.on('finish', () => {
        resolve(write_stream.bytesWritten);
      });
      write_stream.on('error', (err) => {
        reject(err);
      });
    });
  

  if(!fs.existsSync(target_path)) {
    msg.reply('Template not found in cache; downloading');
    await download();
  } 
  
  const file_hash = sha256sum(target_path);
  if (file_hash !== VALID_TEMPLATE_HASH) {
    console.log('Hash mismatch, re downloading');
    await download();
  
    const new_hash = sha256sum(target_path);
    assert(new_hash == VALID_TEMPLATE_HASH, `file_hash: ${file_hash} new_hash: ${new_hash} valid_hash: ${VALID_TEMPLATE_HASH}`);
  }

  return target_path;
}
async function CreateClip(top_text, bottom_text) {
  const src_clip_path = await getSourceClip();
  return src_clip_path;
}

module.exports = {
  commands:
    [
      {
        name: 'crabrave',
        f: (message, args) => {
          const [_, top_text, bottom_text] = args;
          msg = message;
          CreateClip(top_text, bottom_text).then((clip_path) => {
            message.reply(`Crabrave ${top_text} ${bottom_text} clip_path: ${clip_path}`);
          })
        }
      }
    ]
};