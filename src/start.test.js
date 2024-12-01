const { start } = require('./start');

describe('start()', () => {
  test('should return the input it receives', () => {
    const input = 'start!';
    const result = start(input);
    expect(result).toBe(input);
  });

});

