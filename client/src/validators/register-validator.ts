import z from "zod";

export const registerValidator = z.object({
  email: z.email("Email is required and must be valid"),
  name: z.string("Name is required").trim().min(1, "Name is required"),
  password: z
    .string("Password is required")
    .trim()
    .min(8, "Password must be atleast 8 characters long"),
  confirmPassword: z
    .string("Confirm Password is required")
    .trim()
    .min(8, "Confirm Password must be atleast 8 characters long"),
});

export type registerValidatorType = z.infer<typeof registerValidator>;
