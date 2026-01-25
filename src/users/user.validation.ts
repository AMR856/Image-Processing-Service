import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJpYXQiOjE3NjkzNTk3MjgsImV4cCI6MTc2OTk2NDUyOH0.w9Iw1NkvNJPVVBzcCk0ML6XRNBk9hg2COT1x_t-smd4

