import { useMutation, useQuery } from "@tanstack/react-query"
import { getMeApi, loginApi, logoutApi } from "./api.auth";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { useNavigate } from "@tanstack/react-router";


export const useLogin = () => {
  const navigate = useNavigate();
    const { mutate: login, isPending: isLoading } = useMutation({
        mutationFn: loginApi,
        onSuccess: (user) => {
            queryClient.setQueryData(["me"], user);
            toast.success("Zalogowano pomyślnie!");
            navigate({ to: "/" });
        },
        onError: (error: Error) => {
            if (error.message.startsWith("403")) {
                toast.error("Nieprawidłowa nazwa użytkownika lub hasło");
            } else {
                toast.error("Wystąpił błąd logowania");
            }
        }
    });

    return { login, isLoading }
}

export const useMe = () => {
  const {data: user, isLoading} = useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
  return { user, isLoading }
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { mutate: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["me"] });
      navigate({ to: "/login" });
    },
    onError: () => {
      toast.error("Błąd wylogowania");
    }
  });

  return { logout };
};
