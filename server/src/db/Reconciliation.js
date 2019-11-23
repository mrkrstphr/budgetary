import { snakeCase } from 'lodash';
import makeUuid from 'uuid/v4';
import { desnakeify, pickFirst, snakeify } from 'lib';

export default class Reconciliation {
  constructor(conn) {
    this.conn = conn;
  }

  fetchById(id) {
    return pickFirst(
      desnakeify(
        this.conn('account_reconciliation')
          .select('*')
          .where('id', id),
      ),
    );
  }

  findByIds(ids) {
    return desnakeify(
      this.conn('account_reconciliation')
        .select('*')
        .whereIn('id', ids),
    );
  }

  fetchByAccountId(accountId) {
    return this.conn('account_reconciliation')
      .select('*')
      .where('account_id', accountId)
      .orderBy('start_date', 'DESC')
      .then(desnakeify);
  }

  create(accountId, details) {
    return desnakeify(
      pickFirst(
        this.conn('account_reconciliation')
          .insert(
            snakeify({ id: makeUuid(), accountId, status: 'Open', ...details }),
          )
          .returning('*'),
      ),
    );
  }

  markAccountTransactionReconciled(accountId, reconciliationId) {
    return desnakeify(
      pickFirst(
        this.conn('transaction_accounts')
          .update(snakeify({ reconciliationId }))
          .returning('*')
          .where({ id: accountId }),
      ),
    );
  }
}
