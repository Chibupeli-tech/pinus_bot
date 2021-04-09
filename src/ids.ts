const ownerId = '258680327906525184';

const roleConfig = {
  owner: ownerId, 
  allowedUsers: [
    ownerId,
    '359336905185165322' // shasha
  ],
  bannsedUsers: [
    '318834208741261312',
    '594919505956700170'
  ]
}
import { User } from 'discord.js';
import { Config } from './cfg';
export class UserConfig extends Config {
  owner: string = ownerId;
  allowedUsers: string[] = [
    ownerId,
  ];
  bannedUsers: string[] = [];
  allowedGroups: string[] = [];
  getName() { return 'USER_CONFIG'; }
  // Wrapper func for better type completion
  public static getInstance(...args: any): UserConfig{
    return this._getInstance(args[0] || '');
  }

  async getAllowed() { await this.update(); return this.allowedUsers; }
  async getBanned() { await this.update(); return this.bannedUsers; }
  async getAllowedGroups() { await this.update(); return this.allowedGroups; }
  isUserAllowed(u: User): boolean {
     return this.allowedUsers.includes(u.id);
  }
  addBanned(userId: string) {
    this.bannedUsers.push(userId);
    this.save();
  }

  addAllowed(userId: string) {
    this.allowedUsers.push(userId);
    this.save();
  }
  addAllowedGroup(groupId: string) {
    this.allowedGroups.push(groupId);
    this.save();
  }
} 
// module.exports = {bannedIds, allowedIds, ownerId};