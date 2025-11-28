import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("Database connected at", new Date().toLocaleString());
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

export { prisma, connectDatabase };
