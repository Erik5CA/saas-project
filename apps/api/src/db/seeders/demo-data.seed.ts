import { db } from "..";
import { users, tenants, memberships, roles } from "../schema";
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function main() {
  console.log("🌱 Starting demo data seeding...");

  await db.transaction(async (tx) => {
    // 1. Get Roles
    const [ownerRole] = await tx.select().from(roles).where(eq(roles.name, 'OWNER')).limit(1);
    const [adminRole] = await tx.select().from(roles).where(eq(roles.name, 'ADMIN')).limit(1);
    const [memberRole] = await tx.select().from(roles).where(eq(roles.name, 'MEMBER')).limit(1);

    if (!ownerRole || !adminRole || !memberRole) {
      throw new Error("Roles not found. Please run seed:role-permissions first.");
    }

    // 2. Create Tenant
    const [tenant] = await tx.insert(tenants).values({
      name: "SaaS Demo Corp",
    }).returning();

    console.log(`✅ Created Tenant: ${tenant.name} (${tenant.id})`);

    // 3. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const [ownerUser] = await tx.insert(users).values({
      email: 'owner@saas.com',
      password: hashedPassword,
    }).returning();

    const [adminUser] = await tx.insert(users).values({
      email: 'admin@saas.com',
      password: hashedPassword,
    }).returning();

    const [memberUser] = await tx.insert(users).values({
      email: 'member@saas.com',
      password: hashedPassword,
    }).returning();

    console.log(`✅ Created Users: owner@saas.com, admin@saas.com, member@saas.com`);

    // 4. Create Memberships
    await tx.insert(memberships).values([
      {
        userId: ownerUser.id,
        tenantId: tenant.id,
        roleId: ownerRole.id,
      },
      {
        userId: adminUser.id,
        tenantId: tenant.id,
        roleId: adminRole.id,
      },
      {
        userId: memberUser.id,
        tenantId: tenant.id,
        roleId: memberRole.id,
      },
    ]);

    console.log(`✅ Assigned memberships for all users in tenant ${tenant.name}`);
  });

  console.log("🏁 Demo data seeding completed successfully.");
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
