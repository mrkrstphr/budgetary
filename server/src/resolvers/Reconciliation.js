export const Reconciliation = {
  account({ accountId }, params, context) {
    return context.dataloaders.accountById.load(accountId);
  },
  transactions(reconciliation, params, context) {
    return context.dbal.transactions.fetchForReconciliation(reconciliation);
  },
};
