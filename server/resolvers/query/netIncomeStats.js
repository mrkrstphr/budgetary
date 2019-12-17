module.exports = async function netIncomeStats(root, args, context) {
  await context.requireAuthorization();
  // This is hacky...
  return {};
};
