module.exports = {
  account({ account, accountId }, params, context) {
    if (account) {
      return account;
    }

    return context.dataloaders.accountById.load(accountId);
  },
  created({ createdAt }) {
    return createdAt;
  },
};
