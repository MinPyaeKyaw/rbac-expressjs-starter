import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing data
  await knex('permission').del();
  await knex('action').del();
  await knex('channel').del();

  // Insert actions
  await knex('action').insert([
    {
      id: '242b2ed2-0757-11f0-9bc1-32adce0096f0',
      name: 'Create',
      description: 'Create new records',
      is_deleted: false,
    },
    {
      id: '242b6262-0757-11f0-9bc1-32adce0096f0',
      name: 'Delete',
      description: 'Delete records',
      is_deleted: false,
    },
    {
      id: '9e50ed1a-075b-11f0-9bc1-32adce0096f0',
      name: 'View',
      description: 'View records',
      is_deleted: false,
    },
    {
      id: 'a18f576e-075b-11f0-9bc1-32adce0096f0',
      name: 'Update',
      description: 'Update existing records',
      is_deleted: false,
    },
  ]);

  // Insert channels
  await knex('channel').insert([
    {
      id: '6682d258-05e0-11f0-9bc1-32adce0096f0',
      name: 'Web',
      description: 'Web application channel',
      is_deleted: false,
    },
    {
      id: 'b366f7a2-0761-11f0-9bc1-32adce0096f0',
      name: 'Mobile',
      description: 'Mobile application channel',
      is_deleted: false,
    },
    {
      id: 'c477e8b3-0761-11f0-9bc1-32adce0096f0',
      name: 'API',
      description: 'API channel',
      is_deleted: false,
    },
  ]);

  console.log('✅ Seeded actions and channels');
}
