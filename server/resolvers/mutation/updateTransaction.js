module.exports = async function updateTransaction(
  root,
  { id, transaction: { date, description, accounts } },
  context,
) {
  await context.requireAuthorization();
  return context.dbal.transactions
    .update(id, date, description, accounts)
    .then((transaction) => ({ transaction }));
};
