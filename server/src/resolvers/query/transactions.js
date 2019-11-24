export function transactions(root, { filters, paging }, context) {
  return context.dbal.transactions.filterTransactions(filters, paging);
}
