export function createTransaction(
  root,
  { transaction: { date, description, accounts: splits } },
  context
) {
  return context.dbal.transactions
    .createTransaction(date, description, splits)
    .then(transaction => ({ transaction }));
}
