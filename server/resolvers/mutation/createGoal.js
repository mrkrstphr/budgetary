module.exports = async function createGoal(root, { goal: goalInput }, context) {
  await context.requireAuthorization();

  const { accountId, ...goal } = goalInput;
  return context.dbal.goals
    .createGoal(accountId, goal)
    .then(newGoal => ({ goal: newGoal }));
};
