module.exports = {
  totalExpenses({ name: month }, args, context) {
    return context.dataloaders.calculateExpensesByMonth
      .load(month)
      .then((data) => (data ? data.total : 0));
  },
  totalIncome({ name: month }, args, context) {
    return context.dataloaders.calculateIncomeByMonth
      .load(month)
      .then((data) => (data ? data.total : 0));
  },
};
