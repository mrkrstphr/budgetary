export const Account = {
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
};
