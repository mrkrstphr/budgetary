import makeUuid from 'uuid/v4';
import { desnakeify, pickFirst } from 'lib';

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
        .then(v => v.initial_balance),
      this.conn('transaction_accounts')
        .select(this.conn.raw('COALESCE(SUM(amount), 0) AS sum'))
        .where({ account_id: accountId })
        .then(pickFirst)
        .then(v => v.sum),
    ]);
    return parseFloat(initialBalance) + parseFloat(transactions);
  }

  createAccount(type, name) {
    return desnakeify(
      pickFirst(
        this.conn('accounts').insert({ id: makeUuid(), type, name }, '*')
      )
    );
  }

  fetchAccounts() {
    return desnakeify(
      this.conn('accounts')
        .select('*')
        .orderBy('name', 'ASC')
    );
  }

  fetchById(id) {
    return desnakeify(
      pickFirst(
        this.conn('accounts')
          .select('*')
          .where('id', id)
      )
    );
  }

  findByIds(ids) {
    return desnakeify(
      this.conn('accounts')
        .select('*')
        .whereIn('id', ids)
    );
  }
}

export default Account;
