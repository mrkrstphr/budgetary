import makeUuid from 'uuid/v4';

class Account {
  constructor(conn) {
    this.conn = conn;
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
}

export default Account;
