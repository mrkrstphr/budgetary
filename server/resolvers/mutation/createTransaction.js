module.exports = async function createTransaction(
  root,
  { transaction: { date, description, accounts: splits } },
  context,
) {
  await context.requireAuthorization();
  return context.dbal.transactions
    .createTransaction(date, description, splits)
    .then(transaction => ({ transaction }));
};
