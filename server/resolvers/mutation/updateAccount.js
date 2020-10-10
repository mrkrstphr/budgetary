module.exports = async function updateAccount(
  root,
  { id, account: accountDetails },
  context,
) {
  await context.requireAuthorization();
  return context.dbal.accounts
    .update(id, accountDetails)
    .then((account) => ({ account }));
};
