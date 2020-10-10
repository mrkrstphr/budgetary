const { isNil } = require('lodash');
const yup = require('yup');

function validateFinishReconciliation(context) {
  return yup.object().shape({
    id: yup
      .string()
      .required()
      .test(
        'validate-exists',
        'Reconciliation not found',
        async function validateReconcilationExists(value) {
          const reconciliation = await context.dbal.reconciliation.fetchById(
            value,
          );

          return !isNil(reconciliation);
        },
      )
      .test(
        'validate-open',
        'Reconciliation is already completed',
        async function validateReconcilationOpen(value) {
          const reconciliation = await context.dbal.reconciliation.fetchById(
            value,
          );

          return (
            isNil(reconciliation) ||
            reconciliation.status.toLowerCase() === 'open'
          );
        },
      ),
  });
}

const finishReconciliation = {
  validationSchema: validateFinishReconciliation,
  resolve: async function finishReconciliation(root, { id }, context) {
    await context.requireAuthorization();
    return context.dbal.reconciliation
      .update(id, { status: 'Complete' })
      .then((reconciliation) => ({ reconciliation }));
  },
};

module.exports = finishReconciliation;
