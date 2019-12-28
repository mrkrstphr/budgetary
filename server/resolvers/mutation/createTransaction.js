const yup = require('yup');

function validateCreateTransaction(context) {
  // throw new Error('yellow');
  return yup.object().shape({
    transaction: yup
      .object()
      .required()
      .test(
        'validate-transaction-balances',
        'Transaction must balance; all amounts must add up to zero.',
        async function validateNotExists(data) {
          if ('accounts' in data) {
            const total = data.accounts.reduce(
              (prevTotal, { amount = 0 }) => prevTotal + amount,
              0,
            );

            if (total !== 0) {
              return false;
            }
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
      .then(transaction => ({ transaction }));
  },
};

module.exports = createTransaction;
