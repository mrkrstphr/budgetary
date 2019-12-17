import { addDays } from 'date-fns';
import { isNil } from 'lodash';
import Joi from '@hapi/joi';

function validateCreateReconciliation(context) {
  return Joi.object({
    accountId: Joi.string().required(),
    /*.test({
        name: 'validate-exists',
        message: 'Account not found',
        test: async function(value) {
          if (!value) {
            return true;
          }

          const account = await context.dbal.accounts.fetchById(value);

          return !isNil(account);
        },
      })*/ details: Joi.object(
      {
        startDate: Joi.date().required(),
        endDate: Joi.date()
          .required()
          .when('startDate', {
            is: Joi.date(),
            then: Joi.date().min(Joi.ref('details.startDate')),
          }),
        /*.test(
            'validate-not-exists',
            'A reconciliation already exists within this date range',
            async function(endDate, { accountId }) {
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
            }
          )*/ startingBalance: Joi.number().required(),
        endingBalance: Joi.number().required(),
      }
    ).required(),
  });
}

export const createReconciliation = {
  validationSchema: validateCreateReconciliation,
  resolve: function createReconciliation(
    root,
    { accountId, details },
    context
  ) {
    return context.dbal.reconciliation
      .create(accountId, details)
      .then(reconciliation => ({ reconciliation }));
  },
};
