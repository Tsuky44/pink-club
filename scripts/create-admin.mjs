import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

async function main() {
  console.log("\n🔑 Création du compte admin Pink Club\n");

  const email = await ask("Email admin : ");
  const name = await ask("Nom : ");
  const password = await ask("Mot de passe : ");

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: "admin", name },
    create: { email, name, password: hash, role: "admin" },
  });

  console.log(`\n✅ Admin créé : ${user.email} (id: ${user.id})\n`);
  rl.close();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
