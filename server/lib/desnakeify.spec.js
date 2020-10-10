// import { expect } from 'chai';
const desnakeify = require('./desnakeify');

describe('db/lib/desnakeify()', () => {
  it('should snakeCase all attributes of the passed object', () =>
    desnakeify({ first: 1, second_item: 'second', thirdItem: [3] }).then(
      (result) => {
        expect(result).toEqual({
          first: 1,
          secondItem: 'second',
          thirdItem: [3],
        });
      },
    ));

  it('should snakeCase all attributes of all objects in the passed array', () =>
    desnakeify([
      { first: 1, second_item: 'second', thirdItem: [3] },
      {
        jumbo_letter: 'A',
        mixedCase: true,
        superrad: 15,
        another: 14.4,
      },
    ]).then((results) => {
      expect(results).toEqual([
        { first: 1, secondItem: 'second', thirdItem: [3] },
        {
          jumboLetter: 'A',
          mixedCase: true,
          superrad: 15,
          another: 14.4,
        },
      ]);
    }));

  it('should work with nested objects', () =>
    desnakeify({ money: { value: 14, unit_type: 'USD' } }).then((results) => {
      expect(results).toEqual({
        money: {
          value: 14,
          unitType: 'USD',
        },
      });
    }));

  it('should work when a promise is passed', () =>
    desnakeify(Promise.resolve({ a_a: 'A', bB: 'B', c: 'C' })).then(
      (results) => {
        expect(results).toEqual({ aA: 'A', bB: 'B', c: 'C' });
      },
    ));

  it('should return the passed data when neither an array nor object is passed', () =>
    Promise.all([
      desnakeify('monkey').then((results) => {
        expect(results).toEqual('monkey');
      }),
      desnakeify(14).then((results) => {
        expect(results).toEqual(14);
      }),
      desnakeify(true).then((results) => {
        expect(results).toEqual(true);
      }),
      desnakeify([1, 2, 3]).then((results) => {
        expect(results).toEqual([1, 2, 3]);
      }),
    ]));

  it('should not mess up Date objects', () => {
    const myDate = new Date();
    return desnakeify({ foo_bar: myDate }).then((results) => {
      expect(results).toEqual({ fooBar: myDate });
    });
  });
});
