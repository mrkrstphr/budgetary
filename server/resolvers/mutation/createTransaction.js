const Decimal = require('decimal.js');
const yup = require('yup');

function validateCreateTransaction() {
  return yup.object().shape({
    transaction: yup
      .object()
      .required()
      .test(
        'validate-transaction-balances',
        'Transaction must balance; all amounts must add up to zero.',
        async function validateNotExists(data) {
          if ('accounts' in data) {
            const difference = data.accounts.reduce(
              (sum, row) => sum.plus(row.amount),
              new Decimal(0),
            );

            return difference.equals(0);
          }

          return true;
        },
      ),
  });
}

const createTransaction = {
  validationSchema: validateCreateTransaction,
  resolve: async function createTransaction(
    root,
    { transaction: { date, description, accounts: splits } },
    context,
  ) {
    await context.requireAuthorization();
    return context.dbal.transactions
      .createTransaction(date, description, splits)
      .then((transaction) => ({ transaction }));
  },
};

module.exports = createTransaction;
