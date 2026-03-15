import { loginSchema } from "@/types/login-types";
import type z from "zod";

const fakeUser = { id: 1, name: "John doe", email: "johndoe@gmail.com" };

export const loginMock = async ({ email, password }: z.infer<typeof loginSchema>) => {
  await new Promise(res => setTimeout(res, 800));
  if (email === "johndoe@gmail.com" && password === "johndoe123") {
    localStorage.setItem("token", "fake-jwt-token");
    return fakeUser;
  }
  throw new Error("Nieprawidłowe dane");
};

export const getMeMock = async () => {
  await new Promise(res => setTimeout(res, 400));
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");
  return fakeUser;
};

export const logoutMock = async () => {
  await new Promise(res => setTimeout(res, 300));
  localStorage.removeItem("token");
};