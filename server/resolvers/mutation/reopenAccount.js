module.exports = async function reopenAccount(root, { id }, context) {
  await context.requireAuthorization();
  return context.dbal.accounts
    .update(id, { isOpen: true })
    .then(account => ({ account }));
};
