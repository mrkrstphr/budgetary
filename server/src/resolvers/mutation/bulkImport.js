export function bulkImport(root, { transactions }, context) {
  return Promise.all(
    transactions.map(({ date, description, accounts: splits }) =>
      context.dbal.transactions.createTransaction(date, description, splits)
    )
  ).then(() => true);
}
