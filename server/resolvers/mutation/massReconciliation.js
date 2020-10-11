module.exports = async function markReconciled(
  root,
  { transactionAccounts },
  context,
) {
  await context.requireAuthorization();
  return transactionAccounts.map(({ transactionAccountId, reconciliationId }) =>
    context.dbal.reconciliation.markAccountTransactionReconciled(
      transactionAccountId,
      reconciliationId,
    ),
  );
};
