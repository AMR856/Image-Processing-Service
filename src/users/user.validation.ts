import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiQW1yQWxudXMiLCJpYXQiOjE3NjkyNzQxNDUsImV4cCI6MTc2OTg3ODk0NX0.GnaJ6_Clsy8vb-k9Vj5UDeCeek4QWEAlFKViVtNyPOk
// /mnt/g/C++ Course/PGTA5447607481.jpg

