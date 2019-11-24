export function accounts(root, args, context) {
  return context.dbal.accounts.fetchAccounts();
}
