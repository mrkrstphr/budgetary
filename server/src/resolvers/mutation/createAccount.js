export function createAccount(root, { account: accountInput }, context) {
  const { type, name } = accountInput;

  return context.dbal.accounts
    .createAccount(type, name)
    .then(account => ({ account }));
}
