import z from "zod";

export const loginValidator = z.object({
  email: z.email("Email is required and must be valid"),
  password: z
    .string("Password is required")
    .trim()
    .min(8, "Password must be atleast 8 characters long"),
});

export type loginValidatorType = z.infer<typeof loginValidator>;
