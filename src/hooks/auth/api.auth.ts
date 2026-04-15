import { api } from "@/lib/api";
import type { User } from "@/types/user";
import type { loginSchema } from "@/types/login-types";
import type z from "zod";

export const loginApi = async (credentials: z.infer<typeof loginSchema>): Promise<User> => {
  return api.post<User>("/login", credentials);
};

export const getMeApi = async (): Promise<User> => {
  return api.get<User>("/me");
};

export const logoutApi = async (): Promise<void> => {
  await api.post<void>("/logout", {});
};
