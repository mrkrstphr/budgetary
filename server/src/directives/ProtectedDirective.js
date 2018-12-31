import { SchemaDirectiveVisitor } from 'apollo-server';
import { defaultFieldResolver } from 'graphql';

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function(result, args, context, info) {
      const user = await context.getUser();
      if (!user) {
        throw Error('Unauthorized');
      }
      return resolve(this, args, context, info);
    };
  }
}

export default AuthDirective;
