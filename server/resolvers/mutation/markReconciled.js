module.exports = async function markReconciled(
  root,
  { accountId, reconciliationId = null },
  context,
) {
  await context.requireAuthorization();
  return context.dbal.reconciliation.markAccountTransactionReconciled(
    accountId,
    reconciliationId,
  );
};
