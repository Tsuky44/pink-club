import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

async function main() {
  console.log("⚠️  Cette action va supprimer TOUS les comptes utilisateurs !");
  const confirm = await question("Es-tu sûr ? (tape 'oui' pour confirmer) : ");
  
  if (confirm !== "oui") {
    console.log("❌ Annulé.");
    rl.close();
    return;
  }

  // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
  console.log("🗑️  Suppression des votes...");
  await prisma.vote.deleteMany();
  
  console.log("🗑️  Suppression des photos...");
  await prisma.photo.deleteMany();
  
  console.log("🗑️  Suppression des RSVPs...");
  await prisma.eventRsvp.deleteMany();
  
  console.log("🗑️  Suppression des sessions...");
  await prisma.session.deleteMany();
  
  console.log("🗑️  Suppression des accounts...");
  await prisma.account.deleteMany();
  
  console.log("🗑️  Suppression de tous les utilisateurs...");
  await prisma.user.deleteMany();

  console.log("✅ Tous les comptes ont été supprimés.");
  console.log("\n👤 Création du nouveau compte admin :\n");

  const name = await question("Nom : ");
  const email = await question("Email : ");
  const username = await question("Pseudo : ");
  const password = await question("Mot de passe : ");

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(`\n✅ Admin créé : ${user.name} (${user.email})`);
  rl.close();
}

main()
  .catch((e) => {
    console.error("❌ Erreur :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
