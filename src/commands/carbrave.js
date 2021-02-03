const ytdl = require('ytdl-core');
const fs = require('fs');
const { MessageAttachment } = require('discord.js')
const { join } = require('path');
const { execSync } = require('child_process');

const { sha256sum, quoteWrap } = require('../utils');
const { assert } = require('console');
const { cwd } = require('process');

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


  if (!fs.existsSync(target_path)) {
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

function makeComplexFilter(filter_list) {
  const format_filter_data = (filter_data) => Object.entries(filter_data).map(([k, v]) => `${k}=${v}`).join(':');

  const filters = [];
  filter_list.forEach(el => {
    filters.push(`${el[0]}=${format_filter_data(el[1])}`);
  });

  const filter_str = `[in]${filters.join(', ')}[out]`;
  console.log({ filter_str });
  return filter_str;
}

async function CreateClip(top_text, bottom_text, type) {
  const tmp_out_path = '/tmp/output.mp4';
  const src_clip_path = await getSourceClip();

  const drawtext_params = {
    fontsize: 48,
    fontcolor: 'white',
    box: 1,
    boxcolor: 'black@0.5',
    boxborderw: 5,
    fontfile: join(cwd(), 'assets', 'OpenSans-Regular.ttf'),
    x: '(w-text_w)/2'
  };

  const vf_config = [
    ['drawtext', {
      ...drawtext_params,
      text: quoteWrap(top_text),
      y: 50,
    }],
    ['drawtext', {
      ...drawtext_params,
      text: quoteWrap(bottom_text),
      y: '(h-text_h-50)',
    }],
  ];

  const filter = makeComplexFilter(vf_config);
  const cmd = `ffmpeg -i ${src_clip_path} -vf "${filter}" -c:a copy ${tmp_out_path} -y`

  execSync(cmd);
  const file_hash_slice = sha256sum(tmp_out_path).slice(0, 24);

  const final_path = `/tmp/${file_hash_slice}.mp4`;
  fs.renameSync(tmp_out_path, final_path);
  return final_path;
}

function commandWrapper(message, top_text, bottom_text, type = 'video') {
  CreateClip(top_text, bottom_text, type).then((clip_path) => {
    const attachment = new MessageAttachment(clip_path);
    message.channel.send(attachment);
  })
    .catch(e => {
      message.reply(`Crabrave error: ${e.message}`);
    })
}

module.exports = {
  commands:
    [
      {
        name: 'crabrave',
        f: (message, args) => {
          const [_, ...rest] = args;
          
          if(rest.length == 0) {
            message.reply('Чел ты...');
            return;
          }

          const middle      = Math.floor(rest.length / 2);
          const top_text    = rest.slice(0,middle).join(' ');
          const bottom_text = rest.slice(middle).join(' ');

          msg = message;
          message.reply('Работаем');
          commandWrapper(message, top_text, bottom_text);
        }
      },
    ]
};