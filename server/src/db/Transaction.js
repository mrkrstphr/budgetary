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

  categoryBreakdownForMonth(month) {
    return this.conn('transaction_accounts AS ta')
      .select(['a.id', 'a.name AS category'])
      .sum('ta.amount AS amount')
      .join('transactions AS t', 't.id', 'ta.transaction_id')
      .join('accounts AS a', 'a.id', 'ta.account_id')
      .where(this.conn.raw(`to_char(date, 'YYYY-MM')`), month)
      .andWhere('a.type', 'expense')
      .groupBy(['a.id', 'a.name'])
      .orderBy('a.name');
  }

  countAccountTransactionsForPeriod(accountId, period) {
    const query = this.conn('transaction_accounts AS ta')
      .select(this.conn.raw('COALESCE(SUM(ta.amount), 0) AS total'))
      .join('transactions AS t', 't.id', 'ta.transaction_id')
      .where('ta.account_id', accountId);

    const conn = this.conn;

    switch (period.toLowerCase()) {
      case 'thismonth':
        query.andWhere(function() {
          this.where(
            't.date',
            '>=',
            conn.raw(`date_trunc('month', now())`),
          ).andWhere(
            't.date',
            '<',
            conn.raw(
              `date_trunc('month', date_trunc('month', now()) + '1 month'::interval)`,
            ),
          );
        });
        break;

      case 'lastmonth':
        query.andWhere(function() {
          this.where(
            't.date',
            '>=',
            conn.raw(
              `date_trunc('month', date_trunc('month', now()) - '1 month'::interval)`,
            ),
          ).andWhere('t.date', '<', conn.raw(`date_trunc('month', now())`));
        });
        break;

      case 'year':
        query.andWhere(function() {
          this.where(
            't.date',
            '>=',
            conn.raw(`date_trunc('year', now())`),
          ).andWhere(
            't.date',
            '<',
            conn.raw(`(date_part('year', now()) || '-12-31')::date`),
          );
        });
        break;

      case 'total':
      default:
      // do nothing...
    }

    return query.then(v => (v.length ? v[0].total : 0));
  }

  countTransactionsForPeriod(period) {
    const query = this.conn('transaction_accounts AS ta')
      .select(this.conn.raw('COALESCE(SUM(ta.amount), 0) AS total'))
      .join('transactions AS t', 't.id', 'ta.transaction_id');

    const conn = this.conn;

    switch (period.toLowerCase()) {
      case 'thismonth':
        query.where(function() {
          this.where(
            't.date',
            '>=',
            conn.raw(`date_trunc('month', now())`),
          ).andWhere(
            't.date',
            '<',
            conn.raw(
              `date_trunc('month', date_trunc('month', now()) + '1 month'::interval)`,
            ),
          );
        });
        break;

      case 'lastmonth':
        query.where(function() {
          this.where(
            't.date',
            '>=',
            conn.raw(
              `date_trunc('month', date_trunc('month', now()) - '1 month'::interval)`,
            ),
          ).andWhere('t.date', '<', conn.raw(`date_trunc('month', now())`));
        });
        break;

      case 'lastthree':
        query.where(function() {
          this.where(
            't.date',
            '>=',
            conn.raw(
              `date_trunc('month', date_trunc('month', now()) - '3 month'::interval)`,
            ),
          ).andWhere('t.date', '<', conn.raw(`date_trunc('month', now())`));
        });
        break;

      case 'lasttwelve':
        query.where(function() {
          this.where(
            't.date',
            '>=',
            conn.raw(
              `date_trunc('month', date_trunc('month', now()) - '12 month'::interval)`,
            ),
          ).andWhere('t.date', '<', conn.raw(`date_trunc('month', now())`));
        });
        break;

      case 'total':
      default:
      // do nothing...
    }

    return query.then(v => (v.length ? v[0].total : 0));
  }

  fetchUniqueMonths() {
    const month = `to_char(date, 'YYYY-MM')`;

    return this.conn('transactions')
      .select(this.conn.raw(`DISTINCT ${month} AS name`))
      .orderBy(this.conn.raw(month), 'DESC');
  }

  filterTransactions(filters = {}) {
    const query = this.conn('transactions AS t')
      .distinct('t.*')
      .orderBy('t.date', 'DESC');

    if ('month' in filters) {
      query.where(this.conn.raw(`to_char(t.date, 'YYYY-MM')`), filters.month);
    }

    if ('accountId' in filters) {
      query
        .join('transaction_accounts AS ta', 'ta.transaction_id', 't.id')
        .andWhere('account_id', filters.accountId);
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
        // const account = await this.account.fetchById(split.accountId);
        return this.createSplit(
          transaction.id,
          split.accountId,
          split.amount,
          // account.type === 'expense' ? split.amount * -1 : split.amount,
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
