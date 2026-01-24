const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const UserModel = {
  findByUsername(username: string) {
    return prisma.users.findUnique({
      where: { username },
    });
  },

  findById(id: number) {
    return prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
  },

  create(data: { username: string; password: string }) {
    return prisma.users.create({ data });
  },

};
