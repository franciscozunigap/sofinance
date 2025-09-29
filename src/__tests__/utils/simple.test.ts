// Test simple para verificar que Jest funciona
describe('Simple Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should validate string operations', () => {
    const str = 'Hello World';
    expect(str.length).toBe(11);
    expect(str.toUpperCase()).toBe('HELLO WORLD');
  });

  it('should validate array operations', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr.length).toBe(5);
    expect(arr.includes(3)).toBe(true);
    expect(arr.filter(n => n > 3)).toEqual([4, 5]);
  });
});
