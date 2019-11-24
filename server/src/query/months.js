export function months(root, args, context) {
  return context.dbal.transactions.fetchUniqueMonths();
}
