export const Token = {
  user({ user_id: userId }, params, context) {
    return context.dataloaders.findUserById.load(userId);
  },
};
