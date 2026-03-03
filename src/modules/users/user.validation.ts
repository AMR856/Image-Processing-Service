import { z } from "zod";

export class AuthValidationSchemas {
  static authSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format")
      .transform((val) => val.toLowerCase()),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJpYXQiOjE3NjkzNTk3MjgsImV4cCI6MTc2OTk2NDUyOH0.w9Iw1NkvNJPVVBzcCk0ML6XRNBk9hg2COT1x_t-smd4

export type AuthInput = z.infer<typeof AuthValidationSchemas.authSchema>;
