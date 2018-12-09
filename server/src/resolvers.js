export default {
  Mutation: {
    createTransaction(
      root,
      {
        transaction: { date, description, accounts: splits },
      },
      context,
    ) {
      return context.dbal.transactions
        .createTransaction(date, description, splits)
        .then(transaction => ({ transaction }));
    },
  },
  Query: {
    accounts(root, args, context) {
      return context.dbal.accounts.fetchAccounts();
    },
    transactions(root, { filters, paging }, context) {
      return context.dbal.transactions
        .filterTransactions(filters)
        .then(r => ({ items: r })); // TODO: FIXME:
    },
  },
  Transaction: {
    accounts({ id }, params, context) {
      return context.dataloaders.findCategoriesForTransaction
        .load(id)
        .then(d => {
          console.log(d);
          return d;
        });
    },
  },
};
