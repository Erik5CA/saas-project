import { and, eq, inArray } from "drizzle-orm";
import { db } from "..";
import { roles, permissions, rolePermissions } from "../schema";

// --------------------
// CONSTANTES
// --------------------

export const PERMISSIONS = [
  "manage_tenant",

  "invite_user",
  "remove_user",
  "view_users",

  "create_project",
  "update_project",
  "delete_project",
  "view_projects",

  "create_task",
  "update_task",
  "delete_task",
  "assign_task",
  "view_tasks",

  "create_comment",
  "delete_comment",

  "create_document",
  "update_document",
  "delete_document",
  "view_documents",

  "send_message",
  "view_chat",
];

export const ROLES = ["OWNER", "ADMIN", "MEMBER"];

const ROLE_PERMISSIONS = {
  OWNER: PERMISSIONS,

  ADMIN: [
    "invite_user",
    "remove_user",
    "view_users",

    "create_project",
    "update_project",
    "view_projects",

    "create_task",
    "update_task",
    "assign_task",
    "view_tasks",

    "create_comment",

    "create_document",
    "update_document",
    "view_documents",

    "send_message",
    "view_chat",
  ],

  MEMBER: [
    "view_projects",

    "create_task",
    "update_task",
    "view_tasks",

    "create_comment",

    "view_documents",

    "send_message",
    "view_chat",
  ],
};

// --------------------
// SEEDERS
// --------------------

async function seedPermissions(tx: any) {
  console.log("Seeding permissions...");

  const existing = await tx
    .select()
    .from(permissions)
    .where(inArray(permissions.action, PERMISSIONS));

  const existingSet = new Set(existing.map((p) => p.action));

  const toInsert = PERMISSIONS.filter((p) => !existingSet.has(p));

  if (toInsert.length > 0) {
    await tx.insert(permissions).values(
      toInsert.map((action) => ({
        action,
      }))
    );
  }

  const all = await tx
    .select()
    .from(permissions)
    .where(inArray(permissions.action, PERMISSIONS));

  const map = new Map<string, string>();
  all.forEach((p) => map.set(p.action, p.id));

  return map;
}

async function seedRoles(tx: any) {
  console.log("Seeding roles...");

  const existing = await tx
    .select()
    .from(roles)
    .where(inArray(roles.name, ROLES));

  const existingSet = new Set(existing.map((r) => r.name));

  const toInsert = ROLES.filter((r) => !existingSet.has(r));

  if (toInsert.length > 0) {
    await tx.insert(roles).values(
      toInsert.map((name) => ({
        name,
      }))
    );
  }

  const all = await tx
    .select()
    .from(roles)
    .where(inArray(roles.name, ROLES));

  const map = new Map<string, string>();
  all.forEach((r) => map.set(r.name, r.id));

  return map;
}

async function seedRolePermissions(
  tx: any,
  roleMap: Map<string, string>,
  permissionMap: Map<string, string>
) {
  console.log("Seeding role-permissions...");

  const inserts: { roleId: string; permissionId: string }[] = [];

  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleMap.get(roleName);

    if (!roleId) {
      throw new Error(`Role not found: ${roleName}`);
    }

    for (const perm of perms) {
      const permissionId = permissionMap.get(perm);

      if (!permissionId) {
        throw new Error(`Permission not found: ${perm}`);
      }

      inserts.push({ roleId, permissionId });
    }
  }

  // 🔥 evitar duplicados en DB
  for (const item of inserts) {
    const exists = await tx
      .select()
      .from(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, item.roleId),
          eq(rolePermissions.permissionId, item.permissionId)
        )
      );

    if (exists.length === 0) {
      await tx.insert(rolePermissions).values(item);
    }
  }
}

// --------------------
// MAIN
// --------------------

async function main() {
  console.log("🌱 Starting seed...");

  await db.transaction(async (tx) => {
    const permissionMap = await seedPermissions(tx);
    const roleMap = await seedRoles(tx);

    await seedRolePermissions(tx, roleMap, permissionMap);
  });

  console.log("✅ Seed completed");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
})