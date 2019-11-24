import Account from './Account';
import Reconciliation from './Reconciliation';
import Transaction from './Transaction';
import User from './User';

export function createDbal(conn) {
  return {
    accounts: new Account(conn),
    reconciliation: new Reconciliation(conn),
    transactions: new Transaction(conn),
    users: new User(conn),
  };
}
