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
    account(root, { id }, context) {
      return context.dbal.accounts.fetchById(id);
    },
    accounts(root, args, context) {
      return context.dbal.accounts.fetchAccounts();
    },
    months(root, args, context) {
      return context.dbal.transactions.fetchUniqueMonths();
    },
    spendingBreakdown(root, { month }, context) {
      return context.dbal.transactions.categoryBreakdownForMonth(month);
    },
    transactions(root, args, context) {
      return context.dbal.transactions
        .filterTransactions(args.filters)
        .then(r => ({ items: r })); // TODO: FIXME: pagination type stuff
    },
  },
  Account: {
    thisMonth(account, args, context) {
      return context.dbal.transactions.countAccountTransactionsForPeriod(
        account.id,
        'thisMonth',
      );
    },
    lastMonth(account, args, context) {
      return context.dbal.transactions.countAccountTransactionsForPeriod(
        account.id,
        'lastMonth',
      );
    },
    thisYear(account, args, context) {
      return context.dbal.transactions.countAccountTransactionsForPeriod(
        account.id,
        'year',
      );
    },
    total(account, args, context) {
      return context.dbal.transactions.countAccountTransactionsForPeriod(
        account.id,
        'total',
      );
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
