import { Channel, GuildChannel, GuildChannelManager, GuildManager, Structures, TextChannel } from 'discord.js';
import { gunzipSync, gzipSync } from 'zlib';
import Config from '../../config';

function objHas(a: object, b: object): boolean {
  const [jsona, jsonb] =
    [
      JSON.stringify(a).replace(/{|}/gm, ''),
      JSON.stringify(b).replace(/{|}/gm, '')
    ].sort((a, b) => b.length - a.length);

  const idx = jsona.indexOf(jsonb);
  console.log({ idx, jsona, jsonb });
  return idx >= 0;

}
const USE_GZIP = true;
export class GuildDb {
  private static instance: GuildDb;
  private static CHANNEL_NAME = 'pinus-bot-backstage';

  private constructor() { }

  private db_channels: Map<string, GuildChannel | undefined> = new Map();
  private db_guild: Map<string, Object> = new Map();
  private rebuild_timeout_map: Map<string, NodeJS.Timeout | null> = new Map();



  public static getInstance(): GuildDb {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private static async createBackstageChannel(channel_manager: GuildChannelManager) {

    const channel = await channel_manager.create(GuildDb.CHANNEL_NAME)
    await channel.updateOverwrite(channel.guild.roles.everyone, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: false,
    });
    return channel;
  }

  isUpdatePending(guild_id: string): boolean {
    const x = this.rebuild_timeout_map.get(guild_id);
    return !!x;
  }

  async init(guilds: GuildManager) {
    for (const [id, guild] of guilds.cache) {
      const text_channels = guild.channels.cache.filter(e => e.type === 'text');
      let channel = text_channels.find(e => e.name === GuildDb.CHANNEL_NAME);
      if (channel) {
        const fetched = await this.fetchDb(channel);
        this.db_guild.set(id, fetched);
        this.scheduleUpdate(id);
      }
      if (!channel) {
        GuildDb.createBackstageChannel(guild.channels).then((new_channel: TextChannel) => {
          channel = new_channel;
        }).catch(e => { throw e; });
      }
      this.db_channels.set(id, channel);
    }
  }

  autoZip(payload: string): string {
    const ziped = gzipSync(payload).toString('base64');
    // Dont bother if gziped payload takes more space
    return ziped.length < payload.length ? ziped : payload;
  }

  setValue(guild_id: string, obj: Object, force: boolean = false) {
    const channel = this.db_channels.get(guild_id);
    if (!channel)
      throw new Error(`Channel not found for guild_id=${guild_id}`);

    if (!force) {
      const in_mem = this.db_guild.get(guild_id) || {};
      const same = objHas(in_mem, obj);
      if (same) {
        return;
      }
    }

    const sendMessage = (msg: any) =>
      channel.fetch()
        .then((c: Channel) => {
          if (c.type !== 'text')
            throw new Error(`Channel ${c.id}is not a text channel`);

          const channel: TextChannel = c as TextChannel;

          channel.send(msg).catch(e => { throw e });
        })
        .catch(e => { throw e; })

    const old_db = this.db_guild.get(guild_id) || {};
    this.db_guild.set(guild_id, Object.assign(old_db, obj));

    const json = JSON.stringify(obj);

    if (!this.isUpdatePending(guild_id)) {
      console.log('scheduling update')
      this.scheduleUpdate(guild_id);
    }

    if (USE_GZIP) {
      const zip = this.autoZip(json);
      sendMessage(zip);
      return;
    }

    sendMessage(json);
  }

  autoUnzip(message: string) {
    try {
      return JSON.parse(message);
    } catch {
      const unzip = gunzipSync(Buffer.from(message, 'base64')).toString()
      return JSON.parse(unzip);
    }
  }
  async safeGet(guild_id: string, key: string): Promise<any> {
    try {
      return await this.getValue(guild_id, key)
    } catch(e) {
      return undefined;
    } 
  }
  async getValue(guild_id: string, key: string): Promise<any> {
    const in_mem = this.db_guild.get(guild_id) || {};
    if (key in in_mem) {
      // Bruh what the fuck bro I just checked if key is there or not
      // let me access it
      //@ts-ignore
      return in_mem[key];
    }

    const channel = this.db_channels.get(guild_id);
    if (!channel)
      throw new Error(`Channel not found for guild_id=${guild_id}`);

    const mm = (channel as TextChannel).messages;

    const tmp_obj = {};
    const messages = await mm.fetch({ limit: 10 })

    const msg_by_me = messages.filter(msg => msg.client.user?.id == msg.author.id).array().reverse();

    for (const message of msg_by_me) {
      const msgData = this.autoUnzip(message.content);
      Object.assign(tmp_obj, msgData);
    }

    if (key in tmp_obj) {
      if (!this.isUpdatePending(guild_id))
        this.scheduleUpdate(guild_id);
      //@ts-ignore
      return tmp_obj[key];
    }

    throw new Error("Key not found");
  }

  scheduleUpdate(guild_id: string): void {
    if (this.isUpdatePending(guild_id))
      return;

    const timeout = setTimeout(() => {
      this.rebuldDatabase(guild_id)
    }, Config.DB_REBUILD_TO || 10 * 60 * 1000);
    this.rebuild_timeout_map.set(guild_id, timeout);
  }
  async fetchDb(channel: GuildChannel) {
    const mm = (channel as TextChannel).messages;

    const tmp_obj = {};
    const messages = await mm.fetch({ limit: 55 })

    const msg_by_me = messages.filter(msg => msg.client.user?.id == msg.author.id).array().reverse();

    for (const message of msg_by_me) {
      const msgData = this.autoUnzip(message.content);
      Object.assign(tmp_obj, msgData);
    }
    return tmp_obj;
  }

  async rebuldDatabase(guild_id: string) {
    console.log('db rebuild start');
    const channel = this.db_channels.get(guild_id);
    if (!channel)
      throw new Error(`Channel not found for guild_id=${guild_id}`);

    const mm = (channel as TextChannel).messages;

    const tmp_obj = {};
    const messages = await mm.fetch({ limit: 55 })

    const msg_by_me = messages.filter(msg => msg.client.user?.id == msg.author.id).array().reverse();

    for (const message of msg_by_me) {
      const msgData = this.autoUnzip(message.content);
      Object.assign(tmp_obj, msgData);
      message.delete();
    }

    this.db_guild.set(guild_id, tmp_obj);

    this.setValue(guild_id, tmp_obj, true);

    this.rebuild_timeout_map.set(guild_id, null);
    console.log('db rebuild end');
  }
}