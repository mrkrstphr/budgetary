exports.up = function(db) {
  return db.schema.table('accounts', table => {
    table
      .boolean('show_in_menu')
      .defaultTo(true)
      .notNullable();
    table
      .boolean('is_open')
      .defaultTo(true)
      .notNullable();
  });
};

exports.down = function(db) {
  return db.schema.table('accounts', table => {
    table.dropColumns('show_in_menu', 'is_open');
  });
};
