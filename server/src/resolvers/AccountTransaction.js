export const AccountTransaction = {
  account({ account, accountId }, params, context) {
    if (account) {
      return account;
    }

    return context.dataloaders.accountById.load(accountId);
  },
  reconciliation({ reconciliationId }, { id }, context) {
    return (
      reconciliationId &&
      context.dataloaders.reconciliationById.load(reconciliationId)
    );
  },
};
