import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing data
  await knex('role').del();

  // Insert roles
  await knex('role').insert([
    {
      id: 'bfbdd16a-05e0-11f0-9bc1-32adce0096f0',
      name: 'Super Admin',
      description: 'Super Administrator with full system access',
      is_deleted: false,
    },
    {
      id: '91e945da-0a45-11f0-9bc1-32adce0096f0',
      name: 'Admin',
      description: 'Administrator with management access',
      is_deleted: false,
    },
    {
      id: 'c8c02538-05e0-11f0-9bc1-32adce0096f0',
      name: 'Developer',
      description: 'Developer role',
      is_deleted: false,
    },
    {
      id: 'd9d13649-05e0-11f0-9bc1-32adce0096f0',
      name: 'User',
      description: 'Regular user role',
      is_deleted: false,
    },
  ]);

  console.log('✅ Seeded roles');
}
