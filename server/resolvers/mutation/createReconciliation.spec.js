// import { expect } from 'chai';
// import { ValidationError } from 'yup';
// import { createReconciliation } from './createReconciliation';

// describe('mutation createReconciliation()', function() {
//   describe('validation', function() {
//     it('should throw an error for a missing account #', async () => {
//       const ctx = {
//         dbal: {
//           reconciliation: {
//             findBetween() {
//               return { id: '121' };
//             },
//           },
//         },
//       };
//       const validator = createReconciliation.validationSchema(ctx);

//       let error = null;

//       try {
//         await validator.validate(
//           {
//             details: {
//               startDate: new Date(2019, 5, 14),
//               endDate: new Date(2019, 6, 13),
//               startingBalance: 141,
//               endingBalance: 251,
//             },
//           },
//           { abortEarly: false }
//         );
//       } catch (e) {
//         error = e;
//       }

//       expect(error).to.be.instanceof(ValidationError);
//       expect(error.errors).to.have.length(1);
//       expect(error.errors[0]).to.equal('accountId is a required field');
//     });

//     it('should throw an error for an invalid account', async () => {
//       const ctx = {
//         dbal: {
//           accounts: {
//             fetchById() {
//               return null;
//             },
//           },
//           reconciliation: {
//             findBetween() {
//               return [];
//             },
//           },
//         },
//       };
//       const validator = createReconciliation.validationSchema(ctx);

//       let error = null;

//       try {
//         await validator.validate(
//           {
//             accountId: '1511',
//             details: {
//               startDate: new Date(2019, 5, 14),
//               endDate: new Date(2019, 6, 13),
//               startingBalance: 141,
//               endingBalance: 251,
//             },
//           },
//           { abortEarly: false }
//         );
//       } catch (e) {
//         error = e;
//       }

//       expect(error).to.be.instanceof(ValidationError);
//       expect(error.errors).to.have.length(1);
//       expect(error.errors[0]).to.equal('Reconciliation not found');
//     });

//     it('should throw an error if end date is before start date', async () => {
//       const ctx = {
//         dbal: {
//           accounts: {
//             fetchById() {
//               return { id: 'lol' };
//             },
//           },
//           reconciliation: {
//             findBetween() {
//               return [];
//             },
//           },
//         },
//       };
//       const validator = createReconciliation.validationSchema(ctx);

//       let error = null;

//       try {
//         await validator.validate(
//           {
//             accountId: 'lol',
//             details: {
//               startDate: new Date(2019, 5, 14),
//               endDate: new Date(2019, 4, 15),
//               startingBalance: 141,
//               endingBalance: 251,
//             },
//           },
//           { abortEarly: false }
//         );
//       } catch (e) {
//         error = e;
//       }

//       expect(error).to.be.instanceof(ValidationError);
//       expect(error.errors).to.have.length(1);
//       expect(error.errors[0]).to.equal('End Date must be after Start Date');
//     });

//     it('should throw an error if a reconciliation already exists for the date range', async () => {
//       const ctx = {
//         dbal: {
//           accounts: {
//             fetchById() {
//               return { id: 'lol' };
//             },
//           },
//           reconciliation: {
//             findBetween() {
//               return [{ id: '101' }];
//             },
//           },
//         },
//       };
//       const validator = createReconciliation.validationSchema(ctx);

//       let error = null;

//       try {
//         await validator.validate(
//           {
//             accountId: 'lol',
//             details: {
//               startDate: new Date(2019, 5, 14),
//               endDate: new Date(2019, 6, 15),
//               startingBalance: 141,
//               endingBalance: 251,
//             },
//           },
//           { abortEarly: false }
//         );
//       } catch (e) {
//         error = e;
//       }

//       expect(error).to.be.instanceof(ValidationError);
//       expect(error.errors).to.have.length(1);
//       expect(error.errors[0]).to.equal(
//         'A reconciliation already exists within this date range'
//       );
//     });
//   });
// });
