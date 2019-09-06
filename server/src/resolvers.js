import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';

export default {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Mutation: {
    bulkImport(root, { transactions }, context) {
      return Promise.all(
        transactions.map(({ date, description, accounts: splits }) =>
          context.dbal.transactions.createTransaction(
            date,
            description,
            splits,
          ),
        ),
      ).then(() => true);
    },
    createAccount(root, { account: accountInput }, context) {
      const { type, name } = accountInput;

      return context.dbal.accounts
        .createAccount(type, name)
        .then(account => ({ account }));
    },
    async createToken(root, { email, password }, context) {
      const user = await context.dbal.users.findOneBy({ email });
      if (!user) {
        return { errors: { password: ['Authentication failed'] } };
      }

      const token = await context.dbal.users.createToken(user);
      return { token };
    },
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
    deleteTransaction(root, { id }, context) {
      return context.dbal.transactions.delete(id).then(() => true);
    },
    updateTransaction(
      root,
      {
        id,
        transaction: { date, description, accounts },
      },
      context,
    ) {
      return context.dbal.transactions
        .update(id, date, description, accounts)
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
    netIncomeStats() {
      // This is hacky...
      return {};
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
    currentBalance({ id }, args, context) {
      return context.dbal.accounts.calculateCurrentBalance(id);
    },
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
  NetIncomeStats: {
    thisMonth(root, args, context) {
      return context.dbal.transactions.countTransactionsForPeriod('thisMonth');
    },
    lastMonth(root, args, context) {
      return context.dbal.transactions.countTransactionsForPeriod('lastMonth');
    },
    threeMonths(root, args, context) {
      return context.dbal.transactions.countTransactionsForPeriod('lastThree');
    },
    twelveMonths(root, args, context) {
      return context.dbal.transactions.countTransactionsForPeriod('lastTwelve');
    },
  },
  Token: {
    user({ user_id: userId }, params, context) {
      return context.dataloaders.findUserById.load(userId);
    },
  },
  Transaction: {
    accounts({ id }, params, context) {
      return context.dataloaders.findCategoriesForTransaction.load(id);
    },
  },
};
