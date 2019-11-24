export function updateTransaction(
  root,
  { id, transaction: { date, description, accounts } },
  context
) {
  return context.dbal.transactions
    .update(id, date, description, accounts)
    .then(transaction => ({ transaction }));
}
