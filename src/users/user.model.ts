const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


export const UserModel = {
  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
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

  create(data: { username: string; password: string }) {
    return prisma.user.create({ data });
  },
};
