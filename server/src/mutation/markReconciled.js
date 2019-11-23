export function markReconciled(
  root,
  { accountId, reconciliationId = null },
  context,
) {
  return context.dbal.reconciliation.markAccountTransactionReconciled(
    accountId,
    reconciliationId,
  );
}
