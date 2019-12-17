module.exports = async function accounts(root, args, context) {
  await context.requireAuthorization();
  return context.dbal.accounts.fetchAccounts();
};
