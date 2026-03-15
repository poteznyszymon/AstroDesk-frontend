import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLogin } from "@/hooks/auth/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema } from "@/types/login-types";

export const Route = createFileRoute("/(auth)/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "johndoe@gmail.com",
      password: "johndoe123",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login(values)
  }

  return (
    <Card className="flex h-screen w-full rounded-none sm:rounded-xl flex-col items-stretch justify-center gap-6 p-8 sm:h-fit sm:max-w-88">
      <h3 className="text-lg font-semibold text-balance">Zaloguj się do Astrodesk</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <Input placeholder="Hasło" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            Zaloguj się
            {isLoading && <Spinner data-icon="inline-end" />}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
