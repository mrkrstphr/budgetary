module.exports = async function account(root, args, context) {
  const me = await context.requireAuthorization();
  return me;
};
