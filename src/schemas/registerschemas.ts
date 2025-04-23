import { z } from 'zod';

export const formDataSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  phonenumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Invalid phone number (digits only)"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  
});