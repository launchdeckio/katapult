const readableInterval = require('./readableInterval');

test('formats correctly', () => {
    expect(readableInterval(1000)).toBe('1000 ms');
    expect(readableInterval(3000)).toBe('3 s');
    expect(readableInterval('3000')).toBe('3 s');
    expect(readableInterval(3100)).toBe('3.1 s');
    expect(readableInterval(20000)).toBe('20 s');
    expect(readableInterval(120000)).toBe('0:02:00');
});