exports.up = function(db) {
  return db.schema.table('accounts', table => {
    table
      .decimal('initial_balance', 20, 2)
      .default(0)
      .notNullable();
  });
};

exports.down = function(db) {
  return db.schema.table('accounts', table => {
    table.dropColumn('initial_balance');
  });
};
