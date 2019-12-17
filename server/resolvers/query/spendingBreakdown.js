module.exports = async function spendingBreakdown(root, { month }, context) {
  await context.requireAuthorization();
  return context.dbal.transactions.categoryBreakdownForMonth(month);
};
