import DL from 'dataloader';

function organizeMultipleResultsById(results, ids, idColumn = 'id') {
  const organizedResults = [];
  ids.forEach(id => {
    const idCollection = results.filter(result => result[idColumn] === id);
    organizedResults.push(idCollection);
  });

  return organizedResults;
}

function organizeResultsById(results, ids, idColumn = 'id') {
  return ids.map(id => {
    const record = results.find(result => result[idColumn] === id);
    return record || null;
  });
}

class DataLoaders {
  constructor(dbal) {
    this.accountById = new DL(ids =>
      dbal.accounts.findByIds(ids).then(data => organizeResultsById(data, ids))
    );

    this.reconciliationById = new DL(ids =>
      dbal.reconciliation
        .findByIds(ids)
        .then(data => organizeResultsById(data, ids))
    );

    this.calculateExpensesByMonth = new DL(months =>
      dbal.transactions
        .calculateExpensesForMonths(months)
        .then(data => organizeResultsById(data, months, 'month'))
    );

    this.calculateIncomeByMonth = new DL(months =>
      dbal.transactions.calculateSumForMonths(months, 'income').then(data => {
        const negated = data.map(({ month, total }) => ({
          month,
          total: total * -1,
        }));
        return organizeResultsById(negated, months, 'month');
      })
    );

    this.findCategoriesForTransaction = new DL(ids =>
      dbal.transactions
        .findCategoriesForTransactionByIds(ids)
        .then(data => organizeMultipleResultsById(data, ids, 'transactionId'))
    );

    this.findUserById = new DL(ids =>
      dbal.users.findUserByIds(ids).then(data => organizeResultsById(data, ids))
    );
  }
}

export default DataLoaders;
