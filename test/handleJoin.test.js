jest.mock('../src/ids');
const { setBannedIds } = require('./testUtils');
setBannedIds([
  'banned',
]);


const { handleJoin } = require('../src/handlers');
const mockGreetingsChannelId = 'mock';


const mockMembers = {
  'banned': {
    id: 'banned',
    guild: {
      channels: {
        cache: {
          find: () => mockGreetingsChannelId,
        },
      },
    },
  },
  'notBanned': {
    id: 'notBanned',
    guild: {
      channels: {
        cache: {
          find: () => mockGreetingsChannelId,
        },
      },
    },
  },
};

test('Should kick member if in the list', () => {
  const callback = jest.fn((channel, member) => {
    expect(channel).toBe(mockGreetingsChannelId);
    expect(member).toBe(mockMembers['banned']);
  });
  handleJoin(mockMembers['banned'],
    mockGreetingsChannelId,
    callback);
  expect(callback).toHaveBeenCalled();
});

test('Should not kick member if not in the list', () => {
  const callback = jest.fn((channel, member) => {
    expect(channel).toBe(mockGreetingsChannelId);
    expect(member).toBe(mockMembers['banned']);
  });
  handleJoin(mockMembers['notBanned'],
    mockGreetingsChannelId,
    callback);
  expect(callback).not.toHaveBeenCalled();
});