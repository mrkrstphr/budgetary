import DL from 'dataloader';

function organizeMultipleResultsById(results, ids, idColumn = 'id') {
  const organizedResults = [];
  ids.forEach(id => {
    const idCollection = results.filter(result => result[idColumn] === id);
    organizedResults.push(idCollection);
  });

  return organizedResults;
}

class DataLoaders {
  constructor(dbal) {
    this.findCategoriesForTransaction = new DL(ids =>
      dbal.transactions
        .findCategoriesForTransactionByIds(ids)
        .then(data => organizeMultipleResultsById(data, ids, 'transaction_id')),
    );
  }
}

export default DataLoaders;
