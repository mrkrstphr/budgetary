module.exports = async function createAccount(
  root,
  { account: accountInput },
  context,
) {
  await context.requireAuthorization();

  const { type, name } = accountInput;
  return context.dbal.accounts
    .createAccount(type, name)
    .then((account) => ({ account }));
};
