module.exports = {
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
};
