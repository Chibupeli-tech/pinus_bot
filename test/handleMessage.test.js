const { handleMessage } = require('../src/handlers');

const mockCommands = [
  {
    name: 'test',
    f: function (message, args) {
      expect(message).toBe(mockCommandMessage);
      expect(args).toBe(['test']);
      pass();
    }
  },
  {
    name: 'error',
    f: function (message, args) {
      throw new Error('Sample error');
    }
  },
  {
    name: 'fail',
    f: function (message, args) {
      throw new Error('This should not be reached')
    }
  }
]
const mockAllowedIds = [
  '0'
];
const mockdMessages = {
  'command': {
    author: { id: '0' },
    content: '..test',
    channel: {
      send: () => { }
    }
  },
  'non-command': {
    author: { id: '0' },
    content: 'test',
    channel: {
      send: () => { }
    }
  },
  'error-command': {
    author: { id: '0' },
    content: '..error',
    channel: {
      send: (text) => { expect(text.toString()).toBe('Error: Sample error'); }
    }
  },
  'not-allowed': {
    author: { id: '12321' },
    content: '..fail',
    channel: {
      send: (text) => { expect(text.toString()).toBe('Error: Sample error'); }
    }
  }
}


test('Properly handle command message', () => {
  handleMessage(mockdMessages['command'],
    mockAllowedIds,
    mockCommands,
    () => { });
  // Dont care about error reporting for now
});

test('Properly handle non-command message', () => {
  expect(handleMessage(mockdMessages['non-command'],
    mockAllowedIds,
    mockCommands,
    () => { })).toBe(undefined);
  // Dont care about error reporting for now
});

test('Properly handle command error', () => {
  handleMessage(mockdMessages['error-command'],
    mockAllowedIds,
    mockCommands,
    (e) => {
      expect(e.toString()).toBe('Error: Sample error');
    });

});

test('Properly handle command from not allowed user', () => {
  expect(handleMessage(mockdMessages['not-allowed'],
    mockAllowedIds,
    mockCommands,
    (e) => { throw e })).toBe(undefined);
});
