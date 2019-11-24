export function reconciliation(root, { id }, context) {
  return context.dbal.reconciliation.fetchById(id);
}
