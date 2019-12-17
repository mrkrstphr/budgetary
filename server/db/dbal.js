const Account = require('./Account');
const Reconciliation = require('./Reconciliation');
const Transaction = require('./Transaction');
const User = require('./User');

module.exports = function createDbal(conn) {
  return {
    accounts: new Account(conn),
    reconciliation: new Reconciliation(conn),
    transactions: new Transaction(conn),
    users: new User(conn),
  };
};
