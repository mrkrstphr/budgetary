const { addDays } = require('date-fns');
const { formatToTimeZone } = require('date-fns-timezone');
const { isNil } = require('lodash');
const yup = require('yup');

function validateCreateReconciliation(context) {
  return yup.object().shape({
    accountId: yup
      .string()
      .required()
      .test({
        name: 'validate-exists',
        message: 'Reconciliation not found',
        async test(value) {
          if (!value) {
            return true;
          }

          const account = await context.dbal.accounts.fetchById(value);

          return !isNil(account);
        },
      }),
    details: yup
      .object()
      .shape({
        startDate: yup.date().required(),
        endDate: yup
          .date()
          .required()
          .when('startDate', (startDate, schema) => {
            if (startDate) {
              return schema.min(
                addDays(startDate, 1),
                'End Date must be after Start Date',
              );
            }

            return schema;
          }),
        startingBalance: yup.number().required(),
        endingBalance: yup.number().required(),
      })
      .required()
      .test(
        'validate-not-exists',
        'A reconciliation already exists within this date range',
        async function validateNotExists({ endDate, startDate }) {
          const { accountId } = this.parent;

          if (!endDate || !startDate || !accountId) {
            return true;
          }

          const reconciliation = await context.dbal.reconciliation.findBetween(
            accountId,
            formatToTimeZone(startDate, 'YYYY-MM-DD', { timeZone: 'UTC' }),
            formatToTimeZone(endDate, 'YYYY-MM-DD', { timeZone: 'UTC' }),
          );

          return reconciliation.length === 0;
        },
      ),
  });
}

const createReconciliation = {
  validationSchema: validateCreateReconciliation,
  resolve: async function createReconciliation(
    root,
    { accountId, details },
    context,
  ) {
    await context.requireAuthorization();
    return context.dbal.reconciliation
      .create(accountId, details)
      .then((reconciliation) => ({ reconciliation }));
  },
};

module.exports = createReconciliation;
