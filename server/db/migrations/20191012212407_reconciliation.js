exports.up = async function(db) {
  await db.schema.createTable('account_reconciliation', function(table) {
    table.uuid('id').primary();
    table
      .uuid('account_id')
      .references('id')
      .inTable('accounts')
      .onDelete('cascade')
      .notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.decimal('starting_balance', 10, 2).notNullable();
    table.decimal('ending_balance', 10, 2).notNullable();
    table.string('status').notNullable();
    table
      .datetime('created')
      .defaultTo(db.raw('NOW()'))
      .notNullable();
  });

  return db.schema.alterTable('transaction_accounts', function(table) {
    table
      .uuid('reconciliation_id')
      .references('id')
      .inTable('account_reconciliation')
      .onDelete('cascade');
  });
};

exports.down = async function(db) {
  await db.schema.alterTable('transaction_accounts', function(table) {
    table.dropColumn('reconciliation_id');
  });

  return db.schema.dropTable('account_reconciliation');
};
