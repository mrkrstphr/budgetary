module.exports = async function updateTransaction(
  root,
  { id, transaction: { date, description, accounts } },
  context,
) {
  await context.requireAuthorization();
  // return context.dbal.transactions
  //   .update(id, date, description, accounts)
  //   .then(transaction => ({ transaction }));
  return context.service
    .transactionUpdate(
      context.dbal.transactions,
      id,
      date,
      description,
      accounts,
    )
    .then((transaction) => ({ transaction }));
};
