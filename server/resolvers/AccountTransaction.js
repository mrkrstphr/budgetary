module.exports = {
  account({ account, accountId }, params, context) {
    if (account) {
      return account;
    }

    return context.dataloaders.accountById.load(accountId);
  },
  reconciliation({ reconciliationId }, args, context) {
    return (
      reconciliationId &&
      context.dataloaders.reconciliationById.load(reconciliationId)
    );
  },
};
