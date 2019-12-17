module.exports = async function deleteTransaction(root, { id }, context) {
  await context.requireAuthorization();
  return context.dbal.transactions.delete(id).then(() => true);
};
