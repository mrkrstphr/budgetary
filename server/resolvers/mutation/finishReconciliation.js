// import { isNil } from 'lodash';
// import * as yup from 'yup';

// function validateFinishReconciliation(context) {
//   return yup.object().shape({
//     id: yup
//       .string()
//       .required()
//       .test('validate-exists', 'Reconciliation not found', async function(
//         value,
//       ) {
//         const reconciliation = await context.dbal.reconciliation.fetchById(
//           value,
//         );

//         return !isNil(reconciliation);
//       })
//       .test(
//         'validate-open',
//         'Reconciliation is already completed',
//         async function(value) {
//           const reconciliation = await context.dbal.reconciliation.fetchById(
//             value,
//           );

//           return (
//             isNil(reconciliation) ||
//             reconciliation.status.toLowerCase() === 'open'
//           );
//         },
//       ),
//   });
// }

// export const finishReconciliation = {
//   validationSchema: validateFinishReconciliation,
//   resolve: async function finishReconciliation(root, { id }, context) {
//     await context.requireAuthorization();
//     return context.dbal.reconciliation
//       .update(id, { status: 'Complete' })
//       .then(reconciliation => ({ reconciliation }));
//   },
// };

module.exports = () => null;
