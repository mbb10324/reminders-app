/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('reminder_table').del()
  await knex('reminder_table').insert([
    {id: 1, description: 'Hearing Appt', date: '2023-01-20', start: '9 AM', end: '10 AM', type: 'Appointment'},
    {id: 2, description: 'Dental Appt', date: '2023-01-19', start: '3 PM', end: '4 PM', type: 'Appointment'},
    {id: 3, description: 'Vision Appt', date: '2023-01-18', start: '11 AM', end: '12 AM', type: 'Appointment'},
  ]);
};
