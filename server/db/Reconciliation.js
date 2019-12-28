const makeUuid = require('uuid/v4');
const { desnakeify, pickFirst, snakeify } = require('../lib');

const handlers = { between: betweenHandler, or: orHandler };

// function doWhere(query, type, ...args) {
//   if (type === 'OR') {
//     return query.orWhere(...args);
//   }

//   return query.andWhere(...args);
// }

function doRawWhere(query, type, ...args) {
  if (type === 'OR') {
    return query.orWhereRaw(...args);
  }

  return query.andWhereRaw(...args);
}

function betweenHandler(query, condition) {
  // eslint-disable-next-line no-underscore-dangle
  const clause = '_clause' in condition ? condition._clause : 'AND';

  if (
    condition.column &&
    Array.isArray(condition.column) &&
    condition.column.length === 2
  ) {
    // TODO: FIXME:
    doRawWhere(
      query,
      clause,
      `? BETWEEN ${snakeify(condition.column[0])} AND ${snakeify(
        condition.column[1],
      )}`,
      condition.value,
    );
  }
}

function orHandler(query, condition) {
  if (condition.value && Array.isArray(condition.value)) {
    query.where(function orWhereHandler() {
      condition.value.forEach(clause => {
        if (clause.type && clause.type in handlers) {
          handlers[clause.type](this, { ...clause, _clause: 'OR' });
        }
      });
    });
  }
}

function whereBuilder(query, conditions) {
  conditions.forEach(condition => {
    if (condition.type && condition.type in handlers) {
      handlers[condition.type](query, condition);
    }
  });

  return query;
}

class Reconciliation {
  constructor(conn) {
    this.conn = conn;
  }

  find(conditions) {
    return desnakeify(
      whereBuilder(this.conn('account_reconciliation').select('*'), conditions),
    );
  }

  findBetween(accountId, startDate, endDate) {
    const query = this.conn('account_reconciliation')
      .where({ account_id: accountId })
      .whereRaw(
        '(? BETWEEN start_date AND end_date ' +
          'OR ? BETWEEN start_date AND end_date)',
        [startDate, endDate],
      );
    return desnakeify(query);
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
            snakeify({
              id: makeUuid(),
              accountId,
              status: 'Open',
              ...details,
              startDate: (details.startDate instanceof Date
                ? details.startDate
                : new Date(details.startDate)
              ).toISOString(),
              endDate: (details.startDate instanceof Date
                ? details.endDate
                : new Date(details.endDate)
              ).toISOString(),
            }),
          )
          .returning('*'),
      ),
    );
  }

  update(id, details) {
    return desnakeify(
      pickFirst(
        this.conn('account_reconciliation')
          .update(snakeify(details))
          .where('id', id)
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

module.exports = Reconciliation;
