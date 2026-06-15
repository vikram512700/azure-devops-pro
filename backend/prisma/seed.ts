import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Phase 1 Database...');

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email: 'vikram@jioplatforms.com' },
    update: {},
    create: {
      email: 'vikram@jioplatforms.com',
      name: 'Vikram',
      role: 'Platform Engineer',
      level: 4,
      experience: 7,
      score: 1500,
    },
  });

  // Example Learning Track (Module)
  const track = await prisma.module.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Azure Virtual Networks',
      description: 'Master Hub-Spoke topology, NSGs, and VNet Peering',
      duration: 120,
      difficulty: 'Intermediate',
    },
  });

  console.log('Seeding complete!');
  console.log('User:', user);
  console.log('Track:', track);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
