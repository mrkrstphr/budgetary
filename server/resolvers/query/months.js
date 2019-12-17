module.exports = async function months(root, args, context) {
  await context.requireAuthorization();
  return context.dbal.transactions.fetchUniqueMonths();
};
