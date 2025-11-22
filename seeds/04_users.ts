import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing data
  await knex('user').del();

  // Hash passwords (default password: 'password123')
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminHashedPassword = await bcrypt.hash('admin123', 10);

  // Insert users
  await knex('user').insert([
    {
      id: 'ff570050-01a1-11f0-9bc1-32adce0096f0',
      username: 'admin',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      phone1: '09876543210',
      phone2: null,
      phone3: null,
      password: adminHashedPassword,
      address1: 'Admin Address',
      address2: null,
      img: null,
      is_deleted: false,
      role_id: '91e945da-0a45-11f0-9bc1-32adce0096f0', // Admin role
    },
    {
      id: 'ab546ce6-f5f2-11ef-9bc1-32adce0096f0',
      username: 'superadmin',
      first_name: 'Super',
      last_name: 'Admin',
      email: 'superadmin@example.com',
      phone1: '09876543211',
      phone2: null,
      phone3: null,
      password: adminHashedPassword,
      address1: 'Super Admin Address',
      address2: null,
      img: null,
      is_deleted: false,
      role_id: 'bfbdd16a-05e0-11f0-9bc1-32adce0096f0', // Super Admin role
    },
    {
      id: 'c1d2e3f4-5678-90ab-cdef-123456789abc',
      username: 'developer',
      first_name: 'Dev',
      last_name: 'User',
      email: 'developer@example.com',
      phone1: '09876543212',
      phone2: null,
      phone3: null,
      password: hashedPassword,
      address1: 'Developer Address',
      address2: null,
      img: null,
      is_deleted: false,
      role_id: 'c8c02538-05e0-11f0-9bc1-32adce0096f0', // Developer role
    },
    {
      id: 'd2e3f4a5-6789-01bc-def0-234567890bcd',
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@example.com',
      phone1: '09876543213',
      phone2: null,
      phone3: null,
      password: hashedPassword,
      address1: 'Test User Address',
      address2: null,
      img: null,
      is_deleted: false,
      role_id: 'd9d13649-05e0-11f0-9bc1-32adce0096f0', // User role
    },
  ]);

  console.log('✅ Seeded users');
  console.log('   Default passwords:');
  console.log('   - admin/superadmin: admin123');
  console.log('   - developer/testuser: password123');
}
