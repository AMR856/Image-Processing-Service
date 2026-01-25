const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const ImageModel = {
  findByUserIdPaginated(userId: number, skip: number, limit: number) {
    return prisma.image.findMany({
      where: {
        userId,
      },
      skip: skip,         
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  create(data: { id: string; url: string; userId: number }) {
    return prisma.image.create({
      data: {
        id: data.id,
        url: data.url,
        user: {
          connect: { id: data.userId },
        }
      },
    });
  },
};
