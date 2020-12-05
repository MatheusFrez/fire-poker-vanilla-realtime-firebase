import randomKey from '../src/common/random-key';

describe('Tests relatived of random key generator common.', () => {
  it('Shoul create a random key', () => {
    const randomKeyGenerated = randomKey('test');
    expect(randomKeyGenerated.length).toEqual(10);
  });
});
