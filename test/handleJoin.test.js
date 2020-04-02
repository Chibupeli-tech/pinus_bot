const { handleJoin } = require('../src/handlers');

const mockGreetingsChannelId = 'mock';
const mockBannedIds = [
  'banned',
];
const mockMembers = {
  'banned': {
    id: 'banned',
    guild: {
      channels: {
        cache: {
          find: () => 0,
        },
      },
    },
  },
  'notBanned': {
    id: 'notBanned',
    guild: {
      channels: {
        cache: {
          find: () => 0,
        },
      },
    },
  },
};

test('Should kick member if in the list', () => {
  expect(
    handleJoin(mockMembers['banned'],
      mockGreetingsChannelId,
      mockBannedIds,
      (channel, member) => {
        expect(channel).toBe(mockGreetingsChannelId);
        expect(member).toBe(mockMembers['banned']);
      })
  ).toBe(undefined);
});

test('Should not kick member if not in the list', () => {
  expect(
    handleJoin(mockMembers['notBanned'],
      mockGreetingsChannelId,
      mockBannedIds,
      (channel, member) => {
        expect(channel).toBe(mockGreetingsChannelId);
        expect(member).toBe(mockMembers['banned']);
      })
  ).toBe(undefined);
});