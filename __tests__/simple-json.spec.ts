import toSimpleJson from '../src/common/simple-json';

describe('Tests relatived of simple json common.', () => {
  it('Shoul remove undefined fields of a object', () => {
    const objectWithTwoPropertiesUndefined = {
      name: 'test',
      description: 'test',
      propertyOne: undefined,
      propertyTwo: undefined,
    };

    const objectConverted = toSimpleJson(objectWithTwoPropertiesUndefined);
    expect(2).toEqual(Object.keys(objectConverted).length);
  });
});
