import makeUuid from 'uuid/v4';

class Transaction {
  constructor(conn) {
    this.conn = conn;
  }

  filterTransactions(filter) {
    return this.conn('transactions')
      .select('*')
      .orderBy('date', 'DESC');
  }

  findCategoriesForTransactionByIds(ids) {
    return this.conn('transaction_accounts AS ta')
      .join('accounts AS a', 'a.id', 'ta.account_id')
      .select([
        'a.*',
        'ta.id AS trans_account_id',
        'ta.amount',
        'ta.transaction_id',
      ])
      .whereIn('ta.transaction_id', ids)
      .then(results =>
        results.map(
          ({ trans_account_id, amount, transaction_id, ...account }) => ({
            id: trans_account_id,
            amount,
            transaction_id,
            account,
          }),
        ),
      );
  }

  async createTransaction(date, description, splits) {
    const transaction = await this.conn('transactions')
      .insert(
        {
          id: makeUuid(),
          date,
          description,
          amount: splits.reduce((sum, split) => sum + split.amount, 0),
        },
        '*',
      )
      .then(r => r[0]);

    await Promise.all(
      splits.map(split =>
        this.createSplit(transaction.id, split.accountId, split.amount),
      ),
    );

    return transaction;
  }

  createSplit(transactionId, accountId, amount) {
    return this.conn('transaction_accounts').insert({
      id: makeUuid(),
      transaction_id: transactionId,
      account_id: accountId,
      amount,
    });
  }
}

export default Transaction;
