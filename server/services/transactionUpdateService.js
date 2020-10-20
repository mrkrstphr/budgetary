module.exports = async function transactionUpdateService(
  transactionDbal,
  transactionId,
  date,
  description,
  accountTransactions,
) {
  // get a list of existing account transactions first...
  const existingAccountTransactions = await transactionDbal.findAccountTransactionsForTransaction(
    transactionId,
  );

  const updatedTransaction = await transactionDbal.update(
    transactionId,
    date,
    description,
  );

  const firstBagOfPromises = accountTransactions.map(
    function processAccountTransaction(accountTransaction) {
      if (accountTransaction.id) {
        // Find the original details about this transaction
        const existingAccountTransaction = existingAccountTransactions.find(
          function findExistingAccountTransaction(testTransaction) {
            return testTransaction.id === accountTransaction.id;
          },
        );

        // If it has been reconciled, and the request is attempting to change anything,
        // throw an error
        if (
          existingAccountTransaction &&
          existingAccountTransaction.reconciliationId
        ) {
          if (
            existingAccountTransaction.amount !== accountTransaction.amount ||
            existingAccountTransaction.accountId !==
              accountTransaction.accountId
          ) {
            throw new Error(
              'Cannot edit a reconciled transaction account mapping',
            );
          }
        }

        // update the existing transaction_account
        return transactionDbal.updateTransactionAccount(
          accountTransaction.id,
          accountTransaction,
        );
      }

      // create a new transaction_account
      return transactionDbal.createTransactionAccount(
        transactionId,
        accountTransaction,
      );
    },
  );

  // find any transaction accounts that were deleted
  const removedTransactions = existingAccountTransactions.filter(
    function filterAccountTransactions(existingAccountTransaction) {
      return (
        accountTransactions.find(function findAccountTransaction(
          accountTransaction,
        ) {
          return accountTransaction.id === existingAccountTransaction.id;
        }) === undefined
      );
    },
  );

  // find any removed transactions that were reconciled
  const reconciledRemovedTransactions = removedTransactions.filter(
    function filterRemovedTransactions(removedTransaction) {
      return removedTransaction.reconciliationId !== null;
    },
  );

  if (reconciledRemovedTransactions.length) {
    throw new Error('Cannot remove a reconciled transaction account mapping');
  }

  const secondBagOfPromises = removedTransactions.map(
    function processRemovedTransaction(removedTransaction) {
      return transactionDbal.removeAccountTransaction(removedTransaction.id);
    },
  );

  return Promise.resolve([...firstBagOfPromises, ...secondBagOfPromises]).then(
    ([transactions]) => ({
      ...updatedTransaction,
      accounts: transactions,
    }),
  );
};
