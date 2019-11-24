import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';
import * as Mutation from './mutation';
import * as Query from './query';
import * as resolvers from './resolvers/index';

export default {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  ...resolvers,
  Mutation: {
    ...Mutation,
    bulkImport(root, { transactions }, context) {
      return Promise.all(
        transactions.map(({ date, description, accounts: splits }) =>
          context.dbal.transactions.createTransaction(date, description, splits)
        )
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
      { transaction: { date, description, accounts: splits } },
      context
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
      { id, transaction: { date, description, accounts } },
      context
    ) {
      return context.dbal.transactions
        .update(id, date, description, accounts)
        .then(transaction => ({ transaction }));
    },
  },
  Query: {
    ...Query,
    account(root, { id }, context) {
      return context.dbal.accounts.fetchById(id);
    },
    accounts(root, args, context) {
      return context.dbal.accounts.fetchAccounts();
    },
    netIncomeStats() {
      // This is hacky...
      return {};
    },
    reconciliation(root, { id }, context) {
      return context.dbal.reconciliation.fetchById(id);
    },
    reconciliations(root, { accountId }, context) {
      return context.dbal.reconciliation.fetchByAccountId(accountId);
    },
    spendingBreakdown(root, { month }, context) {
      return context.dbal.transactions.categoryBreakdownForMonth(month);
    },
    transactions(root, { filters, paging }, context) {
      return context.dbal.transactions.filterTransactions(filters, paging);
    },
  },
  Account: {
    currentBalance({ id }, args, context) {
      return context.dbal.accounts.calculateCurrentBalance(id);
    },
    thisMonth(account, args, context) {
      return context.dbal.transactions.countAccountTransactionsForPeriod(
        account.id,
        'thisMonth'
      );
    },
    lastMonth(account, args, context) {
      return context.dbal.transactions.countAccountTransactionsForPeriod(
        account.id,
        'lastMonth'
      );
    },
    thisYear(account, args, context) {
      return context.dbal.transactions.countAccountTransactionsForPeriod(
        account.id,
        'year'
      );
    },
    total(account, args, context) {
      return context.dbal.transactions.countAccountTransactionsForPeriod(
        account.id,
        'total'
      );
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
