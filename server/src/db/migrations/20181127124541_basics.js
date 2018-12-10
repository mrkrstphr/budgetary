async function up(db) {
  await Promise.all([
    db.schema.createTable('accounts', table => {
      table.uuid('id').primary();
      table
        .uuid('parent_id')
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE');
      table.string('name');
      table.string('type', 20);
      table.timestamps(false, true);
    }),
    db.schema.createTable('transactions', table => {
      table.uuid('id').primary();
      table.date('date').notNullable();
      table.string('description').notNullable();
      table.decimal('amount', 20, 2).notNullable();
      table.timestamps(false, true);
    }),
  ]);
  return db.schema.createTable('transaction_accounts', table => {
    table.uuid('id').primary();
    table
      .uuid('transaction_id')
      .notNullable()
      .references('id')
      .inTable('transactions')
      .onDelete('CASCADE');
    table
      .uuid('account_id')
      .references('id')
      .inTable('accounts')
      .onDelete('CASCADE');
    table.decimal('amount', 20, 2).notNullable();
  });
}

async function down(db) {
  await db.schema.dropTable('transaction_accounts');
  return Promise.all([
    db.schema.dropTable('accounts'),
    db.schema.dropTable('transactions'),
  ]);
}

export { down, up };
