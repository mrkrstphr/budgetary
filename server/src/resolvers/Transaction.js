export const Transaction = {
  accounts({ id }, params, context) {
    return context.dataloaders.findCategoriesForTransaction.load(id);
  },
};
