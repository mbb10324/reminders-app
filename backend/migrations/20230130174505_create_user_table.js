/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_table', table => {
      table.increments();
      table.string('fname', 80);
      table.string('lname', 80);
      table.string('email', 80);
      table.string('username', 80);
      table.string('password', 80);
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_table');
  };