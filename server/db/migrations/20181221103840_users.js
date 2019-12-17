async function up(db) {
  await db.schema.createTable('users', table => {
    table.uuid('id').primary();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamps(false, true);
  });

  return db.schema.createTable('user_tokens', table => {
    table.uuid('id').primary();
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('token').notNullable();
    table.timestamp('expires').notNullable();
    table.timestamps(false, true);
  });
}

async function down(db) {
  await db.schema.dropTable('user_tokens');
  return db.schema.dropTable('users');
}

export { down, up };
