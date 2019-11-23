import { expect } from 'chai';
import { desnakeify } from './desnakeify';

describe('db/lib/desnakeify()', function() {
  it('should snakeCase all attributes of the passed object', async function() {
    expect(
      await desnakeify({ first: 1, second_item: 'second', thirdItem: [3] }),
    ).to.eql({ first: 1, secondItem: 'second', thirdItem: [3] });
  });

  it('should snakeCase all attributes of all objects in the passed array', async function() {
    expect(
      await desnakeify([
        { first: 1, second_item: 'second', thirdItem: [3] },
        {
          jumbo_letter: 'A',
          mixedCase: true,
          superrad: 15,
          another: 14.4,
        },
      ]),
    ).to.eql([
      { first: 1, secondItem: 'second', thirdItem: [3] },
      {
        jumboLetter: 'A',
        mixedCase: true,
        superrad: 15,
        another: 14.4,
      },
    ]);
  });

  it('should work with nested objects', async function() {
    expect(await desnakeify({ money: { value: 14, unit_type: 'USD' } })).to.eql(
      {
        money: {
          value: 14,
          unitType: 'USD',
        },
      },
    );
  });

  it('should work when a promise is passed', async function() {
    expect(
      await desnakeify(Promise.resolve({ a_a: 'A', bB: 'B', c: 'C' })),
    ).to.eql({ aA: 'A', bB: 'B', c: 'C' });
  });

  it('should return the passed data when neither an array nor object is passed', async function() {
    expect(await desnakeify('monkey')).to.equal('monkey');
    expect(await desnakeify(14)).to.equal(14);
    expect(await desnakeify(true)).to.equal(true);
    expect(await desnakeify([1, 2, 3])).to.eql([1, 2, 3]);
  });

  it('should not mess up Date objects', async function() {
    const myDate = new Date();
    expect(await desnakeify({ foo_bar: myDate })).to.eql({ fooBar: myDate });
  });
});
