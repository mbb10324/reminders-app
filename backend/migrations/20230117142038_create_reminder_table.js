/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('reminder_table', table => {
    table.increments();
    table.string('description', 200);
    table.string('date', 80);
    table.string('start', 80);
    table.string('end', 80);
    table.string('type', 80);
    table.integer('user');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reminder_table');
};
