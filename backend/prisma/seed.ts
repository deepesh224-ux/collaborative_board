import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const mockUserId = 'user_123';

    // Upsert a default user so the frontend always has a valid ownerId
    const user = await prisma.user.upsert({
        where: { id: mockUserId },
        update: {},
        create: {
            id: mockUserId,
            email: 'demo@example.com',
            password: 'password123', // In a real app, this would be hashed
            name: 'Demo User',
        },
    });

    console.log('Database seeded with user:', user.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
