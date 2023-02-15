/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('group_relation_table', table => {
        table.increments();
        table.integer("group_id");
        table.integer('user_id');
        table.string('role', 80);
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('group_relation_table');
};
