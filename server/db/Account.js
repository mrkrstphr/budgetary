const { v4: makeUuid } = require('uuid');
const { desnakeify, pickFirst, snakeify } = require('../lib');

class Account {
  constructor(conn) {
    this.conn = conn;
  }

  async calculateCurrentBalance(accountId) {
    const [initialBalance, transactions] = await Promise.all([
      this.conn('accounts')
        .select('initial_balance')
        .where({ id: accountId })
        .then(pickFirst)
        .then((v) => v.initial_balance),
      this.conn('transaction_accounts')
        .select(this.conn.raw('COALESCE(SUM(amount), 0) AS sum'))
        .where({ account_id: accountId })
        .then(pickFirst)
        .then((v) => v.sum),
    ]);
    return parseFloat(initialBalance) + parseFloat(transactions);
  }

  createAccount(type, name) {
    return desnakeify(
      pickFirst(
        this.conn('accounts').insert({ id: makeUuid(), type, name }, '*'),
      ),
    );
  }

  update(id, accountDetails) {
    return desnakeify(
      pickFirst(
        this.conn('accounts')
          .update(snakeify(accountDetails))
          .where({ id })
          .returning('*'),
      ),
    );
  }

  fetchAccounts() {
    return desnakeify(this.conn('accounts').select('*').orderBy('name', 'ASC'));
  }

  fetchById(id) {
    return desnakeify(
      pickFirst(this.conn('accounts').select('*').where('id', id)),
    );
  }

  findByIds(ids) {
    return desnakeify(this.conn('accounts').select('*').whereIn('id', ids));
  }

  fetchSnapshot(id) {
    return desnakeify(
      this.conn('account_snapshots')
        .select('*')
        .where('account_id', id)
        .orderBy('snapshot_date', 'ASC'),
    );
  }
}

module.exports = Account;
