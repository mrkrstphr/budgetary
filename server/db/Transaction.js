const { v4: makeUuid } = require('uuid');
const Account = require('./Account');
const { applyPaging, desnakeify, pickFirst } = require('../lib');

class Transaction {
  constructor(conn) {
    this.conn = conn;
    this.account = new Account(conn);
  }

  calculateExpensesForMonths(months) {
    const month = `to_char(date, 'YYYY-MM')`;

    const query = this.conn('transactions AS t')
      .select(
        this.conn.raw(`DISTINCT ${month} AS month, SUM(ta.amount) AS total`),
      )
      .join('transaction_accounts AS ta', 'ta.transaction_id', 't.id')
      .join('accounts AS a', 'a.id', 'ta.account_id')
      .whereIn('a.type', ['expense', 'liabilities'])
      .whereIn(this.conn.raw(month), months)
      .groupBy(this.conn.raw(month))
      .orderBy(this.conn.raw(`${month}`), 'DESC');

    return query;
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

    const { conn } = this;

    switch (period.toLowerCase()) {
      case 'thismonth':
        query.andWhere(function whereThisMonth() {
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
        query.andWhere(function whereLastMonth() {
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
        query.andWhere(function whereThisYear() {
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

    return query.then((v) => (v.length ? v[0].total : 0));
  }

  countTransactionsForPeriod(period) {
    const expenseQuery = this.conn('transactions AS t')
      .select(this.conn.raw(`SUM(ta.amount) AS total`))
      .join('transaction_accounts AS ta', 'ta.transaction_id', 't.id')
      .join('accounts AS a', 'a.id', 'ta.account_id')
      .whereIn('a.type', ['expense', 'liabilities']);

    const incomeQuery = this.conn('transactions AS t')
      .select(this.conn.raw(`SUM(ta.amount) AS total`))
      .join('transaction_accounts AS ta', 'ta.transaction_id', 't.id')
      .join('accounts AS a', 'a.id', 'ta.account_id')
      .where('a.type', 'income');

    const { conn } = this;

    switch (period.toLowerCase()) {
      case 'thismonth':
        [expenseQuery, incomeQuery].forEach((query) =>
          query.where(function whereThisMonth() {
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
          }),
        );
        break;

      case 'lastmonth':
        [expenseQuery, incomeQuery].forEach((query) =>
          query.where(function whereLastMonth() {
            this.where(
              't.date',
              '>=',
              conn.raw(
                `date_trunc('month', date_trunc('month', now()) - '1 month'::interval)`,
              ),
            ).andWhere('t.date', '<', conn.raw(`date_trunc('month', now())`));
          }),
        );
        break;

      case 'lastthree':
        [expenseQuery, incomeQuery].forEach((query) =>
          query.where(function whereLastThreeMonths() {
            this.where(
              't.date',
              '>=',
              conn.raw(
                `date_trunc('month', date_trunc('month', now()) - '3 month'::interval)`,
              ),
            ).andWhere('t.date', '<', conn.raw(`date_trunc('month', now())`));
          }),
        );
        break;

      case 'lasttwelve':
        [expenseQuery, incomeQuery].forEach((query) =>
          query.where(function whereLastTwelveMonths() {
            this.where(
              't.date',
              '>=',
              conn.raw(
                `date_trunc('month', date_trunc('month', now()) - '12 month'::interval)`,
              ),
            ).andWhere('t.date', '<', conn.raw(`date_trunc('month', now())`));
          }),
        );
        break;

      case 'total':
      default:
      // do nothing...
    }

    const query = conn.raw(
      `SELECT COALESCE((inc.total * -1) - exp.total, 0) AS total FROM (${incomeQuery}) inc CROSS JOIN (${expenseQuery}) exp`,
    );

    return pickFirst(query.then((r) => r.rows)).then(({ total }) => total);
  }

  fetchUniqueMonths() {
    const month = `to_char(date, 'YYYY-MM')`;

    return this.conn('transactions')
      .select(this.conn.raw(`DISTINCT ${month} AS name`))
      .orderBy(this.conn.raw(month), 'DESC');
  }

  filterTransactions(filters = {}, paging = {}) {
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

    return applyPaging(query, paging).then(
      ({ paging: pagingDetails, items }) => ({
        paging: pagingDetails,
        items: desnakeify(items),
      }),
    );
  }

  fetchForReconciliation(reconciliation) {
    const query = this.conn('transactions AS t')
      .distinct('t.*')
      .join('transaction_accounts AS ta', 'ta.transaction_id', 't.id')
      .andWhere('account_id', reconciliation.accountId)
      .orderBy('t.date', 'ASC');

    if (reconciliation.status.toLowerCase() === 'open') {
      query.andWhere(function whereReconciliationOpen() {
        this.where('reconciliation_id', reconciliation.id).orWhere(
          'reconciliation_id',
          null,
        );
      });
    } else {
      query.andWhere('reconciliation_id', reconciliation.id);
    }

    query.whereRaw(
      "t.date BETWEEN ?::date - '5 days'::interval AND ?::date + '5 days'::interval",
      [reconciliation.startDate, reconciliation.endDate],
    );

    return desnakeify(query);
  }

  findCategoriesForTransactionByIds(ids) {
    return this.conn('transaction_accounts AS ta')
      .join('accounts AS a', 'a.id', 'ta.account_id')
      .select([
        'a.*',
        'ta.id AS trans_account_id',
        'ta.amount',
        'ta.transaction_id',
        'ta.reconciliation_id',
      ])
      .whereIn('ta.transaction_id', ids)
      .then(desnakeify)
      .then((results) =>
        results.map(
          ({
            transAccountId,
            amount,
            transactionId,
            reconciliationId,
            ...account
          }) => ({
            id: transAccountId,
            amount,
            transactionId,
            reconciliationId,
            account,
          }),
        ),
      );
  }

  findAccountTransactionsForTransaction(transactonId) {
    return desnakeify(
      this.conn('transaction_accounts')
        .select()
        .where({ transaction_id: transactonId }),
    );
  }

  async createTransaction(date, description, splits) {
    const transaction = await desnakeify(
      pickFirst(
        this.conn('transactions').insert(
          {
            id: makeUuid(),
            date: (date instanceof Date ? date : new Date(date)).toISOString(),
            description,
            amount: splits.reduce((sum, split) => sum + split.amount, 0),
          },
          '*',
        ),
      ),
    );

    await Promise.all(
      splits.map(async (split) =>
        // const account = await this.account.fetchById(split.accountId);
        this.createSplit(
          transaction.id,
          split.accountId,
          split.amount,
          // account.type === 'expense' ? split.amount * -1 : split.amount,
        ),
      ),
    );

    return transaction;
  }

  createSplit(transactionId, accountId, amount) {
    return desnakeify(
      pickFirst(
        this.conn('transaction_accounts')
          .insert({
            id: makeUuid(),
            transaction_id: transactionId,
            account_id: accountId,
            amount,
          })
          .returning('*'),
      ),
    );
  }

  delete(id) {
    return this.conn('transactions').delete().where({ id });
  }

  update(id, date, description) {
    return desnakeify(
      pickFirst(
        this.conn('transactions')
          .update({
            date: (date instanceof Date ? date : new Date(date)).toISOString(),
            description,
          })
          .where({ id })
          .returning('*'),
      ),
    );
  }

  createTransactionAccount(transactionId, accountTransaction) {
    return desnakeify(
      pickFirst(
        this.conn('transaction_accounts')
          .insert({
            id: makeUuid(),
            transaction_id: transactionId,
            account_id: accountTransaction.accountId,
            amount: accountTransaction.amount,
          })
          .returning('*'),
      ),
    );
  }

  updateTransactionAccount(accountTransactionId, accountTransaction) {
    return desnakeify(
      pickFirst(
        this.conn('transaction_accounts')
          .update({
            account_id: accountTransaction.accountId,
            amount: accountTransaction.amount,
          })
          .where({ id: accountTransactionId })
          .returning('*'),
      ),
    );
  }
}

module.exports = Transaction;
