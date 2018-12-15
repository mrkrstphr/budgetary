import makeUuid from 'uuid/v4';
import Account from './Account';

class Transaction {
  constructor(conn) {
    this.conn = conn;
    this.account = new Account(conn);
  }

  calculateSumForMonths(months, type) {
    const month = `to_char(date, 'YYYY-MM')`;

    return this.conn('transactions AS t')
      .select(
        this.conn.raw(`DISTINCT ${month} AS month, SUM(ta.amount) AS total`),
      )
      .join('transaction_accounts AS ta', 'ta.transaction_id', 't.id')
      .join('accounts AS a', 'a.id', 'ta.account_id')
      .where('a.type', type)
      .whereIn(this.conn.raw(month), months)
      .groupBy(this.conn.raw(month))
      .orderBy(this.conn.raw(`${month}`), 'DESC');
  }

  fetchUniqueMonths() {
    const month = `to_char(date, 'YYYY-MM')`;

    return this.conn('transactions')
      .select(this.conn.raw(`DISTINCT ${month} AS name`))
      .orderBy(this.conn.raw(month), 'DESC');
  }

  filterTransactions(filters = {}) {
    const query = this.conn('transactions')
      .select('*')
      .orderBy('date', 'DESC');

    if ('month' in filters) {
      query.where(this.conn.raw(`to_char(date, 'YYYY-MM')`), filters.month);
    }

    return query;
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
      splits.map(async split => {
        const account = await this.account.fetchById(split.accountId);
        return this.createSplit(
          transaction.id,
          split.accountId,
          account.type === 'expense' ? split.amount * -1 : split.amount,
        );
      }),
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
