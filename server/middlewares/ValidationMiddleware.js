const yup = require('yup');

module.exports = async function Mutation(resolve, root, args, context, info) {
  const mutationField = info.schema.getMutationType().getFields()[
    info.fieldName
  ];

  let mutationValidationSchema = mutationField.validationSchema;

  if (mutationValidationSchema) {
    if (typeof mutationValidationSchema === 'function') {
      mutationValidationSchema = mutationValidationSchema(context);
    }

    try {
      await mutationValidationSchema.validate(args, {
        abortEarly: false,
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          errors: error.inner.map(inner => ({
            field: inner.path,
            message: inner.message,
            details: inner.errors,
          })),
        };
      }
      throw error;
    }
  }

  return resolve(root, args, context, info);
};
