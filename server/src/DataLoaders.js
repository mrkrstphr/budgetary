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
    this.calculateExpensesByMonth = new DL(months =>
      dbal.transactions
        .calculateSumForMonths(months, 'expense')
        .then(data => organizeResultsById(data, months, 'month')),
    );

    this.calculateIncomeByMonth = new DL(months =>
      dbal.transactions
        .calculateSumForMonths(months, 'income')
        .then(data => organizeResultsById(data, months, 'month')),
    );

    this.findCategoriesForTransaction = new DL(ids =>
      dbal.transactions
        .findCategoriesForTransactionByIds(ids)
        .then(data => organizeMultipleResultsById(data, ids, 'transaction_id')),
    );
  }
}

export default DataLoaders;
