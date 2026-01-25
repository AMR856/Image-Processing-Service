import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export function getTransformKey(imageId: string, transformations: any) {
  return `image:${imageId}:transform:${Buffer.from(JSON.stringify(transformations)).toString("base64")}`;
}