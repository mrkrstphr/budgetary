const bcrypt = require('bcryptjs');

module.exports = async function createToken(
  root,
  { email, password },
  context,
) {
  const user = await context.dbal.users.findOneBy({ email });
  if (!user) {
    return { errors: { password: ['Authentication failed'] } };
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return { errors: { password: ['Authentication failed'] } };
  }

  context.setUser(user); // request.session.user = user;

  // const token = await context.dbal.users.createToken(user);
  // return { token };
  return { user };
};
