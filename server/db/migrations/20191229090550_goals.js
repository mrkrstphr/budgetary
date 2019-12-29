exports.up = function(db) {
  return db.schema.createTable('goals', table => {
    table.uuid('id').primary();
    table
      .uuid('account_id')
      .references('id')
      .inTable('accounts')
      .onDelete('cascade')
      .notNullable();
    table.string('description').notNullable();
    table.date('due_date').notNullable();
    table.decimal('starting_balance', 20, 2).notNullable();
    table.decimal('goal_balance', 20, 2).notNullable();
    table.timestamps(false, true);
  });
};

exports.down = function(db) {
  return db.schema.dropTable('goals');
};
