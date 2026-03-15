import { useMutation, useQuery } from "@tanstack/react-query"
import { getMeMock, loginMock, logoutMock } from "./mock.auth";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { useNavigate } from "@tanstack/react-router";


export const useLogin = () => {
  const navigate = useNavigate();
    const { mutate: login, isPending: isLoading } = useMutation({
        mutationFn: loginMock,
        onSuccess: (user) => {
            queryClient.setQueryData(["me"], user);
            toast.success("Zalogowano pomyślnie!");
            navigate({ to: "/" });
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Wystąpił błąd logowania");
        }
    });

    return { login, isLoading }
}

export const useMe = () => {
  const {data: user, isLoading} = useQuery({
    queryKey: ["me"],
    queryFn: getMeMock,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
  return { user, isLoading }
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { mutate: logout } = useMutation({
    mutationFn: logoutMock,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.clear();
      navigate({ to: "/login" });
    },
    onError: () => {
      toast.error("Błąd wylogowania");
    }
  });

  return { logout };
};