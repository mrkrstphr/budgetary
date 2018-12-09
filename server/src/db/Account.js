class Account {
  constructor(conn) {
    this.conn = conn;
  }

  fetchAccounts() {
    return this.conn('accounts')
      .select('*')
      .orderBy('name', 'ASC');
  }
}

export default Account;
