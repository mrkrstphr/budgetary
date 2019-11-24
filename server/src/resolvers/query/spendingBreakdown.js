export function spendingBreakdown(root, { month }, context) {
  return context.dbal.transactions.categoryBreakdownForMonth(month);
}
