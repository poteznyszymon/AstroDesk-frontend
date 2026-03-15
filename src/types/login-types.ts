import z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email nie może być pusty").email("Zły format email"),
  password: z.string().min(1, "Hasło nie może być puste"),
});