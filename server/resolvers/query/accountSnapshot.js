module.exports = async function accountSnapshot(root, { accountId }, context) {
  await context.requireAuthorization();
  return context.dbal.accounts.fetchSnapshot(accountId);
};
