module.exports = async function closeAccount(root, { id }, context) {
  await context.requireAuthorization();
  return context.dbal.accounts
    .update(id, { isOpen: false })
    .then((account) => ({ account }));
};
