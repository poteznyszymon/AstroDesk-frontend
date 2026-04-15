import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Nazwa użytkownika nie może być pusta"),
  password: z.string().min(1, "Hasło nie może być puste"),
});