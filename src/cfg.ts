import { GuildDb } from './lib/GuildDb';

export class Config {
  fields: string[] = [];
  guild: string = '';
  static instance: any;
  protected constructor(DO_NOT_SET = false) {
    if (DO_NOT_SET) {
      return;
    }
    //@ts-ignore tsssss.....
    const self = new this.constructor(true);
    console.log(self)
    this.fields = [...Object.keys(self)];
    console.log(this.fields);
  }
  protected  static _getInstance(guild_id: string){
    if (!this.instance) {
      this.instance = new this();
    }
    if (guild_id) {
      this.instance.setGuild(guild_id);
    }
    return this.instance;
  }
  setGuild(guild_id: string) { this.guild = guild_id}
  save() {
    const val = this.fields.reduce((acc, cv) => ({
      ...acc,
      //@ts-ignore
      [cv]: this[cv]
    }), {});

    GuildDb.getInstance().setValue(this.guild, {[this.getName()]: val})
  }
  getName() { return 'INVAL'; }
  update() {
    GuildDb.getInstance().safeGet(this.guild, this.getName())
    .then((d = {}) => Object.entries(d).map(([k, v]) => {
      //@ts-ignore
      this[k] = v;
    }))
  }
}
