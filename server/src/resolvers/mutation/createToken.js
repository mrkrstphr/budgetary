import bcrypt from 'bcryptjs';

export async function createToken(root, { email, password }, context) {
  const user = await context.dbal.users.findOneBy({ email });
  if (!user) {
    return { errors: { password: ['Authentication failed'] } };
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return { errors: { password: ['Authentication failed'] } };
  }

  const token = await context.dbal.users.createToken(user);
  return { token };
}
