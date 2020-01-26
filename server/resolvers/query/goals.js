module.exports = async function goals(root, args, context) {
  await context.requireAuthorization();
  return context.dbal.goals.fetchGoals();
};
