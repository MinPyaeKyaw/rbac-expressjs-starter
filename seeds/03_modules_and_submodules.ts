import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing data
  await knex('sub_module').del();
  await knex('module').del();

  const webChannelId = '6682d258-05e0-11f0-9bc1-32adce0096f0';

  // Insert modules
  await knex('module').insert([
    {
      id: '2059b11a-05dc-11f0-9bc1-32adce0096f0',
      name: 'User Management',
      description: 'User management module',
      is_deleted: false,
      channel_id: webChannelId,
    },
    {
      id: '83732965-a8aa-44a4-b1d5-30b2ef267d2a',
      name: 'Product',
      description: 'Product management module',
      is_deleted: false,
      channel_id: webChannelId,
    },
    {
      id: '394472fe-0a42-11f0-9bc1-32adce0096f0',
      name: 'Unit',
      description: 'Unit management module',
      is_deleted: false,
      channel_id: webChannelId,
    },
  ]);

  // Insert sub-modules
  await knex('sub_module').insert([
    {
      id: '78a5a376-1e8f-11f0-b5b5-df40a1682685',
      name: 'User',
      description: 'User sub-module',
      is_deleted: false,
      module_id: '2059b11a-05dc-11f0-9bc1-32adce0096f0',
      channel_id: webChannelId,
    },
    {
      id: '4ddd5b28-05e6-11f0-9bc1-32adce0096f0',
      name: 'User Role Assign',
      description: 'User role assignment sub-module',
      is_deleted: false,
      module_id: '2059b11a-05dc-11f0-9bc1-32adce0096f0',
      channel_id: webChannelId,
    },
    {
      id: '86b59139-2c35-440e-9c1a-5004b2ff3996',
      name: 'Product',
      description: 'Product sub-module',
      is_deleted: false,
      module_id: '83732965-a8aa-44a4-b1d5-30b2ef267d2a',
      channel_id: webChannelId,
    },
    {
      id: '1976b4cc-f6c6-4529-b628-6cd03c8c2616',
      name: 'Product Category',
      description: 'Product category sub-module',
      is_deleted: false,
      module_id: '83732965-a8aa-44a4-b1d5-30b2ef267d2a',
      channel_id: webChannelId,
    },
  ]);

  console.log('✅ Seeded modules and sub-modules');
}
