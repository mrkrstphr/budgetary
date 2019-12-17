module.exports = async function account(root, { id }, context) {
  await context.requireAuthorization();
  return context.dbal.accounts.fetchById(id);
};
