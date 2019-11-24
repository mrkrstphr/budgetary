import { addDays } from 'date-fns';
import { isNil } from 'lodash';
import * as yup from 'yup';

function validateCreateReconciliation(context) {
  return yup.object().shape({
    accountId: yup
      .string()
      .required()
      .test({
        name: 'validate-exists',
        message: 'Reconciliation not found',
        test: async function(value) {
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
          })
          .test(
            'validate-not-exists',
            'A reconciliation already exists within this date range',
            async function(endDate) {
              if (!endDate || !this.parent.startDate) {
                return true;
              }

              console.log({ dbal: context.dbal });

              const reconciliation = await context.dbal.reconciliation.find([
                {
                  or: [
                    {
                      column: ['startDate', 'endDate'],
                      type: 'between',
                      value: this.parent.startDate,
                    },
                    {
                      column: ['startDate', 'endDate'],
                      type: 'between',
                      value: this.parent.endDate,
                    },
                  ],
                },
              ]);

              return isNil(reconciliation);
            },
          ),
        startingBalance: yup.number().required(),
        endingBalance: yup.number().required(),
      })
      .required(),
  });
}

export const createReconciliation = {
  validationSchema: validateCreateReconciliation,
  resolve: function createReconciliation(
    root,
    { accountId, details },
    context,
  ) {
    return context.dbal.reconciliation
      .create(accountId, details)
      .then(reconciliation => ({ reconciliation }));
  },
};
