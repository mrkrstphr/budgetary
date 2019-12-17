module.exports = async function reconciliations(root, { accountId }, context) {
  await context.requireAuthorization();
  return context.dbal.reconciliation.fetchByAccountId(accountId);
};
