import makeUuid from 'uuid/v4';

class Account {
  constructor(conn) {
    this.conn = conn;
  }

  async calculateCurrentBalance(accountId) {
    const [initialBalance, transactions] = await Promise.all([
      this.conn('accounts')
        .select('initial_balance')
        .where({ id: accountId })
        .then(v => v[0])
        .then(v => v.initial_balance),
      this.conn('transaction_accounts')
        .select(this.conn.raw('COALESCE(SUM(amount), 0) AS sum'))
        .where({ account_id: accountId })
        .then(v => v[0])
        .then(v => v.sum),
    ]);
    return parseFloat(initialBalance) + parseFloat(transactions);
  }

  createAccount(type, name) {
    return this.conn('accounts')
      .insert({ id: makeUuid(), type, name }, '*')
      .then(v => v[0]);
  }

  fetchAccounts() {
    return this.conn('accounts')
      .select('*')
      .orderBy('name', 'ASC');
  }

  fetchById(id) {
    return this.conn('accounts')
      .select('*')
      .where('id', id)
      .then(v => v[0]);
  }
}

export default Account;
