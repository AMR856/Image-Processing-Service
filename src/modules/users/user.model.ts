const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


export const UserModel = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
  },

  create(data: { email: string; password: string }) {
    return prisma.user.create({ data });
  },
};
