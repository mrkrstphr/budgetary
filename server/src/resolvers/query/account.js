export function account(root, { id }, context) {
  return context.dbal.accounts.fetchById(id);
}
