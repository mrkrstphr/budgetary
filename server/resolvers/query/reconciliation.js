module.exports = async function reconciliation(root, { id }, context) {
  await context.requireAuthorization();
  return context.dbal.reconciliation.fetchById(id);
};
