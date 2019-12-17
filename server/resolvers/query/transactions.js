module.exports = async function transactions(
  root,
  { filters, paging },
  context,
) {
  await context.requireAuthorization();
  return context.dbal.transactions.filterTransactions(filters, paging);
};
