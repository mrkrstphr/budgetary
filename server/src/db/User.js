import randToken from 'rand-token';
import makeUuid from 'uuid/v4';

const TOKEN_LIFETIME = 60 * 60 * 8;

class User {
  constructor(conn) {
    this.conn = conn;
  }

  createToken(user) {
    return this.conn('user_tokens')
      .insert(
        {
          id: makeUuid(),
          user_id: user.id,
          // TODO: Auth logic shouldn't be in dbal layer...
          token: randToken.generate(48),
          expires: new Date(
            new Date().getTime() + TOKEN_LIFETIME,
          ).toISOString(),
        },
        '*',
      )
      .then(v => v[0]);
  }

  findUserByIds(ids) {
    return this.conn('users')
      .select('*')
      .whereIn('id', ids);
  }

  findTokenBy(where) {
    const query = this.conn('user_tokens AS t');

    for (const key of Object.keys(where)) {
      query.whereRaw(`LOWER(${key}) = ?`, [where[key].toLowerCase()]);
    }

    return query.then(v => v[0]);
  }

  findOneBy(where) {
    const query = this.conn('users').select('*');

    for (const key of Object.keys(where)) {
      query.whereRaw(`LOWER(${key}) = ?`, [where[key].toLowerCase()]);
    }

    return query.then(v => v[0]);
  }
}

export default User;
