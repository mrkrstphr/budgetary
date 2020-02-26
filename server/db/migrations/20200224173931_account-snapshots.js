exports.up = async function(db) {
  return db.schema.createTable('account_snapshots', function(table) {
    table.uuid('id').primary();
    table
      .uuid('account_id')
      .references('id')
      .inTable('accounts')
      .onDelete('cascade')
      .notNullable();
    table.date('snapshot_date').notNullable();
    table.decimal('balance', 10, 2).notNullable();
    table
      .datetime('created')
      .defaultTo(db.raw('NOW()'))
      .notNullable();
  });


};

exports.down = async function(db) {
  return db.schema.dropTable('account_snapshots');
};
