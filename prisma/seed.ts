import { prisma } from '../src/database/prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Hash das senhas
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  // Criar usuários de teste
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password_hash: adminPasswordHash,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password_hash: userPasswordHash,
    },
  });

  console.log('✅ Usuários criados:');
  console.log(`   👤 Admin: ${admin.email} (senha: admin123)`);
  console.log(`   👤 User: ${user.email} (senha: user123)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
