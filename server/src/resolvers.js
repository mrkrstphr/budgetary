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
    months(root, args, context) {
      return context.dbal.transactions.fetchUniqueMonths();
    },
    transactions(root, args, context) {
      return context.dbal.transactions
        .filterTransactions(args.filters)
        .then(r => ({ items: r })); // TODO: FIXME: pagination type stuff
    },
  },
  Month: {
    totalExpenses({ name: month }, args, context) {
      return context.dataloaders.calculateExpensesByMonth
        .load(month)
        .then(data => (data ? data.total : 0));
    },
    totalIncome({ name: month }, args, context) {
      return context.dataloaders.calculateIncomeByMonth
        .load(month)
        .then(data => (data ? data.total : 0));
    },
  },
  Transaction: {
    accounts({ id }, params, context) {
      return context.dataloaders.findCategoriesForTransaction.load(id);
    },
  },
};
