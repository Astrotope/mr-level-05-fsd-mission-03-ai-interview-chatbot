const { respond } = require('./respond');

describe('respond()', () => {
  test('should return the input it receives', () => {
    const input = 'respond!';
    const result = respond(input);
    expect(result).toBe(input);
  });

});
