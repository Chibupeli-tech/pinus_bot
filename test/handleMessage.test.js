jest.mock('../src/commands');
jest.mock('../src/error');
const { setCommands,
        setAllowedIds,
        setReportError } = require('./testUtils');

const mockCommands = [
  {
    name: 'test',
    f: jest.fn((message, args) => {
      expect(message).toBe(mockMessages['command']);
      //expect(args).toBe(['test']);
    })
  },
  {
    name: 'error',
    f: function (message, args) {
      throw new Error('Sample error');
    }
  },
  {
    name: 'fail',
    f: jest.fn()
  }
];

setCommands(mockCommands);
setAllowedIds([
  '0'
]);
const report = jest.fn((err) => {
  expect(err.toString()).toBe('Error: Sample error');
})
setReportError(report);

const mockMessages = {
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
      send: jest.fn()
    }
  },
  'error-command': {
    author: { id: '0' },
    content: '..error',
    channel: {
      send: jest.fn((text) => { expect(text.toString()).toBe('Error: Sample error'); })
    }
  },
  'not-allowed': {
    author: { id: '12321' },
    content: '..fail',
    channel: {
      send: jest.fn()
    }
  }
}

const { handleMessage } = require('../src/handlers');
describe('On incoming message', () => {
  
  afterEach(() => {    
    jest.clearAllMocks();
  });
  
  it('Properly handle command message', () => {
    handleMessage(mockMessages['command']);
    expect(mockCommands[0].f).toHaveBeenCalled();
    expect(report).not.toHaveBeenCalled();
  });
  
  it('Properly handle non-command message', () => {
    handleMessage(mockMessages['non-command']);
    expect(mockMessages['non-command'].channel.send).not.toHaveBeenCalled();
    expect(report).not.toHaveBeenCalled();
  });
  
  it('Properly handle command error', () => {
    handleMessage(mockMessages['error-command']);
    expect(report).toHaveBeenCalled();
    expect(mockMessages['error-command'].channel.send).toHaveBeenCalled();
  });
  
  it('Properly handle command from not allowed user', () => {
    handleMessage(mockMessages['not-allowed']);
    expect(mockCommands[2].f).not.toHaveBeenCalled();
    expect(mockMessages["not-allowed"].channel.send).not.toHaveBeenCalled();
    expect(report).not.toHaveBeenCalled();
  });  
})
