import '@babel/polyfill'; // TODO: FIXME: can we do this globally?
import transactionUpdateService from './transactionUpdateService';

describe('service::transactionUpdateService()', function testTransactionUpdateService() {
  it('should update existing transactions', () => {
    const fakeDbal = {
      findAccountTransactionsForTransaction() {
        return [
          {
            id: '101',
            accountId: '404',
            amount: '500',
            reconciliationId: null,
          },
          {
            id: '102',
            accountId: '501',
            amount: '-500',
            reconciliationId: null,
          },
        ];
      },
      createTransactionAccount: jest.fn(() => Promise.resolve()),
      removeAccountTransaction: jest.fn(() => Promise.resolve()),
      updateTransactionAccount: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
    };

    const updates = [
      {
        id: '101',
        accountId: '404',
        amount: '350',
        reconciliationId: null,
      },
      {
        id: '102',
        accountId: '502',
        amount: '-350',
        reconciliationId: null,
      },
    ];

    return transactionUpdateService(
      fakeDbal,
      '806',
      '2006-10-31',
      'spooky day',
      updates,
    ).then(() => {
      expect(fakeDbal.createTransactionAccount.mock.calls).toHaveLength(0);
      expect(fakeDbal.removeAccountTransaction.mock.calls).toHaveLength(0);
      expect(fakeDbal.updateTransactionAccount.mock.calls).toHaveLength(2);
      expect(fakeDbal.updateTransactionAccount.mock.calls[0]).toEqual([
        '101',
        updates[0],
      ]);
      expect(fakeDbal.updateTransactionAccount.mock.calls[1]).toEqual([
        '102',
        updates[1],
      ]);
    });
  });

  it('should insert new transaction accounts', () => {
    const fakeDbal = {
      findAccountTransactionsForTransaction() {
        return [
          {
            id: '101',
            accountId: '404',
            amount: '500',
            reconciliationId: null,
          },
          {
            id: '102',
            accountId: '501',
            amount: '-500',
            reconciliationId: null,
          },
        ];
      },
      createTransactionAccount: jest.fn(() => Promise.resolve()),
      removeAccountTransaction: jest.fn(() => Promise.resolve()),
      updateTransactionAccount: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
    };

    const updates = [
      {
        id: '101',
        accountId: '404',
        amount: '500',
        reconciliationId: null,
      },
      {
        id: '102',
        accountId: '502',
        amount: '-450',
        reconciliationId: null,
      },
      {
        accountId: '301',
        amount: '-50',
        reconciliationId: null,
      },
    ];

    return transactionUpdateService(
      fakeDbal,
      '806',
      '2012-08-14',
      'End of the world?',
      updates,
    ).then(() => {
      expect(fakeDbal.createTransactionAccount.mock.calls).toHaveLength(1);
      expect(fakeDbal.createTransactionAccount.mock.calls[0]).toEqual([
        '806',
        updates[2],
      ]);

      expect(fakeDbal.removeAccountTransaction.mock.calls).toHaveLength(0);

      expect(fakeDbal.updateTransactionAccount.mock.calls).toHaveLength(2);
      expect(fakeDbal.updateTransactionAccount.mock.calls[0]).toEqual([
        '101',
        updates[0],
      ]);
      expect(fakeDbal.updateTransactionAccount.mock.calls[1]).toEqual([
        '102',
        updates[1],
      ]);
    });
  });

  it('should remove a transaction account that was removed', () => {
    const fakeDbal = {
      findAccountTransactionsForTransaction() {
        return [
          {
            id: '101',
            accountId: '404',
            amount: '500',
            reconciliationId: null,
          },
          {
            id: '102',
            accountId: '501',
            amount: '-500',
            reconciliationId: null,
          },
        ];
      },
      createTransactionAccount: jest.fn(() => Promise.resolve()),
      removeAccountTransaction: jest.fn(() => Promise.resolve()),
      updateTransactionAccount: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
    };

    const updates = [
      {
        id: '101',
        accountId: '404',
        amount: '550',
        reconciliationId: null,
      },
      {
        accountId: '301',
        amount: '-450',
        reconciliationId: null,
      },
    ];

    return transactionUpdateService(
      fakeDbal,
      '806',
      '1984-10-20',
      'idk',
      updates,
    ).then(() => {
      expect(fakeDbal.createTransactionAccount.mock.calls).toHaveLength(1);
      expect(fakeDbal.createTransactionAccount.mock.calls[0]).toEqual([
        '806',
        updates[1],
      ]);

      expect(fakeDbal.removeAccountTransaction.mock.calls).toHaveLength(1);
      expect(fakeDbal.removeAccountTransaction.mock.calls[0]).toEqual(['102']);

      expect(fakeDbal.updateTransactionAccount.mock.calls).toHaveLength(1);
      expect(fakeDbal.updateTransactionAccount.mock.calls[0]).toEqual([
        '101',
        updates[0],
      ]);
    });
  });

  it('should not allow updating an amount on a transaction account that was reconciled', () => {
    const fakeDbal = {
      findAccountTransactionsForTransaction() {
        return [
          {
            id: '101',
            accountId: '404',
            amount: '500',
            reconciliationId: '86',
          },
          {
            id: '102',
            accountId: '501',
            amount: '-500',
            reconciliationId: '33',
          },
        ];
      },
      createTransactionAccount: jest.fn(() => Promise.resolve()),
      removeAccountTransaction: jest.fn(() => Promise.resolve()),
      updateTransactionAccount: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
    };

    const updates = [
      {
        id: '101',
        accountId: '404',
        amount: '450',
        reconciliationId: '86',
      },
      {
        id: '102',
        accountId: '501',
        amount: '-450',
        reconciliationId: '33',
      },
    ];

    return transactionUpdateService(
      fakeDbal,
      '806',
      '1999-12-31',
      "Party like it's",
      updates,
    ).catch((e) => {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toEqual(
        'Cannot edit a reconciled transaction account mapping',
      );
    });
  });

  it('should not allow updating an account on a transaction account that was reconciled', () => {
    const fakeDbal = {
      findAccountTransactionsForTransaction() {
        return [
          {
            id: '101',
            accountId: '404',
            amount: '500',
            reconciliationId: '86',
          },
          {
            id: '102',
            accountId: '501',
            amount: '-500',
            reconciliationId: '33',
          },
        ];
      },
      createTransactionAccount: jest.fn(() => Promise.resolve()),
      removeAccountTransaction: jest.fn(() => Promise.resolve()),
      updateTransactionAccount: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
    };

    const updates = [
      {
        id: '101',
        accountId: '404',
        amount: '500',
        reconciliationId: '86',
      },
      {
        id: '102',
        accountId: '452',
        amount: '-500',
        reconciliationId: '33',
      },
    ];

    return transactionUpdateService(
      fakeDbal,
      '806',
      '1974-10-11',
      'Foobar',
      updates,
    ).catch((e) => {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toEqual(
        'Cannot edit a reconciled transaction account mapping',
      );
    });
  });

  it('should not allow removing a transaction that was reconciled', () => {
    const fakeDbal = {
      findAccountTransactionsForTransaction() {
        return [
          {
            id: '101',
            accountId: '404',
            amount: '500',
            reconciliationId: '86',
          },
          {
            id: '102',
            accountId: '501',
            amount: '-500',
            reconciliationId: '33',
          },
        ];
      },
      createTransactionAccount: jest.fn(() => Promise.resolve()),
      removeAccountTransaction: jest.fn(() => Promise.resolve()),
      updateTransactionAccount: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
    };

    const updates = [
      {
        id: '101',
        accountId: '404',
        amount: '500',
        reconciliationId: '86',
      },
      {
        accountId: '301',
        amount: '-500',
        reconciliationId: null,
      },
    ];

    return transactionUpdateService(
      fakeDbal,
      '806',
      '2014-10-20',
      'My Transaction',
      updates,
    ).catch((e) => {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toEqual(
        'Cannot remove a reconciled transaction account mapping',
      );
    });
  });
});
