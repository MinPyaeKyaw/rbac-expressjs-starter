import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create action table
  await knex.schema.createTable('action', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 100).notNullable().unique();
    table.text('description').nullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
  });

  // Create channel table
  await knex.schema.createTable('channel', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 100).notNullable();
    table.text('description').nullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
  });

  // Create role table
  await knex.schema.createTable('role', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 100).notNullable().unique();
    table.text('description').nullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
  });

  // Create module table (depends on channel)
  await knex.schema.createTable('module', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 100).notNullable().unique();
    table.text('description').nullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
    table.uuid('channel_id').notNullable();
    table.foreign('channel_id').references('id').inTable('channel');
  });

  // Create sub_module table (depends on module and channel)
  await knex.schema.createTable('sub_module', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 100).notNullable();
    table.text('description').nullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
    table.uuid('module_id').notNullable();
    table.uuid('channel_id').notNullable();
    table.foreign('module_id').references('id').inTable('module');
    table.foreign('channel_id').references('id').inTable('channel');
  });

  // Create user table (depends on role)
  await knex.schema.createTable('user', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('username', 50).notNullable().unique();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('phone1', 20).notNullable();
    table.string('phone2', 20).nullable();
    table.string('phone3', 20).nullable();
    table.string('password', 255).notNullable();
    table.text('address1').nullable();
    table.text('address2').nullable();
    table.string('img', 255).nullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
    table.uuid('role_id').nullable();
    table.foreign('role_id').references('id').inTable('role');
  });

  // Create product_category table
  await knex.schema.createTable('product_category', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 100).notNullable().unique();
    table.text('description').nullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
  });

  // Create product table (depends on product_category)
  await knex.schema.createTable('product', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 100).notNullable().unique();
    table.integer('price').notNullable();
    table.uuid('category_id').nullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
    table.foreign('category_id').references('id').inTable('product_category');
  });

  // Create permission table (depends on module, sub_module, channel, role, action)
  await knex.schema.createTable('permission', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
    table.uuid('module_id').notNullable();
    table.uuid('sub_module_id').notNullable();
    table.uuid('channel_id').notNullable();
    table.uuid('role_id').notNullable();
    table.uuid('action_id').notNullable();
    table.foreign('module_id').references('id').inTable('module');
    table.foreign('sub_module_id').references('id').inTable('sub_module');
    table.foreign('channel_id').references('id').inTable('channel');
    table.foreign('role_id').references('id').inTable('role');
    table.foreign('action_id').references('id').inTable('action');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order of dependencies
  await knex.schema.dropTableIfExists('permission');
  await knex.schema.dropTableIfExists('product');
  await knex.schema.dropTableIfExists('product_category');
  await knex.schema.dropTableIfExists('user');
  await knex.schema.dropTableIfExists('sub_module');
  await knex.schema.dropTableIfExists('module');
  await knex.schema.dropTableIfExists('role');
  await knex.schema.dropTableIfExists('channel');
  await knex.schema.dropTableIfExists('action');
}
