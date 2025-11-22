import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing data
  await knex('permission').del();

  // Constants
  const webChannelId = '6682d258-05e0-11f0-9bc1-32adce0096f0';
  const adminRoleId = '91e945da-0a45-11f0-9bc1-32adce0096f0';
  const superAdminRoleId = 'bfbdd16a-05e0-11f0-9bc1-32adce0096f0';

  // Action IDs
  const createActionId = '242b2ed2-0757-11f0-9bc1-32adce0096f0';
  const deleteActionId = '242b6262-0757-11f0-9bc1-32adce0096f0';
  const viewActionId = '9e50ed1a-075b-11f0-9bc1-32adce0096f0';
  const updateActionId = 'a18f576e-075b-11f0-9bc1-32adce0096f0';

  // Module IDs
  const userManagementModuleId = '2059b11a-05dc-11f0-9bc1-32adce0096f0';
  const productModuleId = '83732965-a8aa-44a4-b1d5-30b2ef267d2a';

  // Sub-module IDs
  const userSubModuleId = '78a5a376-1e8f-11f0-b5b5-df40a1682685';
  const userRoleAssignSubModuleId = '4ddd5b28-05e6-11f0-9bc1-32adce0096f0';
  const productSubModuleId = '86b59139-2c35-440e-9c1a-5004b2ff3996';
  const productCategorySubModuleId = '1976b4cc-f6c6-4529-b628-6cd03c8c2616';

  // Permissions for Admin role - User Management Module
  const adminPermissions = [
    // User sub-module permissions
    {
      module_id: userManagementModuleId,
      sub_module_id: userSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: viewActionId,
      is_deleted: false,
    },
    {
      module_id: userManagementModuleId,
      sub_module_id: userSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: createActionId,
      is_deleted: false,
    },
    {
      module_id: userManagementModuleId,
      sub_module_id: userSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: updateActionId,
      is_deleted: false,
    },
    {
      module_id: userManagementModuleId,
      sub_module_id: userSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: deleteActionId,
      is_deleted: false,
    },
    // User Role Assign sub-module permissions
    {
      module_id: userManagementModuleId,
      sub_module_id: userRoleAssignSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: viewActionId,
      is_deleted: false,
    },
    {
      module_id: userManagementModuleId,
      sub_module_id: userRoleAssignSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: createActionId,
      is_deleted: false,
    },
    {
      module_id: userManagementModuleId,
      sub_module_id: userRoleAssignSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: updateActionId,
      is_deleted: false,
    },
    {
      module_id: userManagementModuleId,
      sub_module_id: userRoleAssignSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: deleteActionId,
      is_deleted: false,
    },
    // Product sub-module permissions
    {
      module_id: productModuleId,
      sub_module_id: productSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: viewActionId,
      is_deleted: false,
    },
    {
      module_id: productModuleId,
      sub_module_id: productSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: createActionId,
      is_deleted: false,
    },
    {
      module_id: productModuleId,
      sub_module_id: productSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: updateActionId,
      is_deleted: false,
    },
    {
      module_id: productModuleId,
      sub_module_id: productSubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: deleteActionId,
      is_deleted: false,
    },
    // Product Category sub-module permissions
    {
      module_id: productModuleId,
      sub_module_id: productCategorySubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: viewActionId,
      is_deleted: false,
    },
    {
      module_id: productModuleId,
      sub_module_id: productCategorySubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: createActionId,
      is_deleted: false,
    },
    {
      module_id: productModuleId,
      sub_module_id: productCategorySubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: updateActionId,
      is_deleted: false,
    },
    {
      module_id: productModuleId,
      sub_module_id: productCategorySubModuleId,
      channel_id: webChannelId,
      role_id: adminRoleId,
      action_id: deleteActionId,
      is_deleted: false,
    },
  ];

  // Insert permissions
  await knex('permission').insert(adminPermissions);

  console.log('✅ Seeded permissions');
}
