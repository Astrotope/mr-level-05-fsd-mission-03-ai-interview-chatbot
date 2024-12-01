const { analyse }  = require('./analyse');

describe('analyse()', () => {
  test('should return the input it receives', () => {
    const input = 'analyse!';
    const result = analyse(input);
    expect(result).toBe(input);
  });

});
