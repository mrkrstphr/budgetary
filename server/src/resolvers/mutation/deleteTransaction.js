export function deleteTransaction(root, { id }, context) {
  return context.dbal.transactions.delete(id).then(() => true);
}
