import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/types/user";

const getUsers = (): Promise<User[]> => api.get<User[]>("/users");

export const useUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  return { data, isLoading };
};
