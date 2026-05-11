import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create default admin user
  const existingUser = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("admin", 10);
    const user = await prisma.user.create({
      data: {
        username: "admin",
        password: hashedPassword,
      },
    });
    console.log("✅ Created default admin user:", user.username);
  } else {
    console.log("✅ Admin user already exists");
  }

  // Create sample data
  const existingClients = await prisma.client.count();

  if (existingClients === 0) {
    const clients = await prisma.client.createMany({
      data: [
        { fullname: "Thandi Njoko", phoneNumber: "0712345678" },
        { fullname: "Nokuthula Dlamini", phoneNumber: "0723456789" },
        { fullname: "Precious Mthembu", phoneNumber: "0734567890" },
      ],
    });
    console.log("✅ Created sample clients");
  }

  const existingInventory = await prisma.inventory.count();

  if (existingInventory === 0) {
    await prisma.inventory.createMany({
      data: [
        {
          itemName: "Brazilian Hair",
          category: "Hair",
          quantity: 20,
          costPrice: 150,
        },
        {
          itemName: "Peruvian Hair",
          category: "Hair",
          quantity: 15,
          costPrice: 180,
        },
        {
          itemName: "Hair Gel",
          category: "Supplies",
          quantity: 10,
          costPrice: 50,
        },
        {
          itemName: "Hair Spray",
          category: "Supplies",
          quantity: 8,
          costPrice: 40,
        },
        {
          itemName: "Shampoo",
          category: "Supplies",
          quantity: 12,
          costPrice: 60,
        },
      ],
    });
    console.log("✅ Created sample inventory items");
  }

  console.log("✅ Database seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
