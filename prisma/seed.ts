import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database for EduFlow AI...");

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    update: {},
    create: {
      id: "demo-org",
      name: "EduFlow Enterprise Academy",
      slug: "demo-org",
    },
  });

  // 2. Create Admin Role
  const adminRole = await prisma.role.upsert({
    where: {
      organizationId_name: {
        organizationId: org.id,
        name: "ADMIN",
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: "ADMIN",
      description: "Organization Administrator with full access",
      isSystemRole: true,
    },
  });

  // 3. Create Demo Users
  const passwordHash = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@eduflow.ai" },
    update: {
      passwordHash,
      organizationId: org.id,
      roleId: adminRole.id,
    },
    create: {
      email: "admin@eduflow.ai",
      name: "Shivam Kumar",
      passwordHash,
      organizationId: org.id,
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "reviewer@eduflow.ai" },
    update: {
      passwordHash,
      organizationId: org.id,
      roleId: adminRole.id,
    },
    create: {
      email: "reviewer@eduflow.ai",
      name: "Dr. Aris Thorne (SME Reviewer)",
      passwordHash,
      organizationId: org.id,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("-----------------------------------------");
  console.log("🔑 Demo Login Credentials:");
  console.log("   Admin Email:    admin@eduflow.ai");
  console.log("   Reviewer Email: reviewer@eduflow.ai");
  console.log("   Password:       Password123!");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
