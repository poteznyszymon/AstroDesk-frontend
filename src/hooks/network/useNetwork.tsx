import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getNetworkDevices,
  getNetworkHistory,
  getAvailableSubnets,
  triggerNetworkScan as triggerNetworkScanApi,
  updateNetworkDeviceHostname as updateNetworkDeviceHostnameApi,
  type NetworkFilters,
} from "./api.network";
import { queryClient } from "@/main";
import { toast } from "sonner";

const NETWORK_KEY = "network";

export const useNetworkDevices = (filters: NetworkFilters, page = 0, size = 50) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [NETWORK_KEY, "devices", filters, page, size],
    queryFn: () => getNetworkDevices(filters, page, size),
    placeholderData: (prev) => prev,
  });
  return { data: data ?? [], isLoading, refetch };
};

export const useNetworkHistory = (macAddress: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: [NETWORK_KEY, "history", macAddress],
    queryFn: () => getNetworkHistory(macAddress as string),
    enabled: !!macAddress,
  });
  return { history: data ?? [], isLoading };
};

export const useAvailableSubnets = (enabled: boolean = true) => {
  const { data, isLoading } = useQuery({
    queryKey: [NETWORK_KEY, "available-subnets"],
    queryFn: getAvailableSubnets,
    enabled,
  });
  return { data: data ?? [], isLoading };
};

export const useTriggerNetworkScan = () => {
  const { mutateAsync: triggerScan, isPending: isLoading } = useMutation({
    mutationFn: (subnets: string[]) => triggerNetworkScanApi(subnets),
    onSuccess: () => {
      toast("Skanowanie sieci zostało uruchomione.", {
        action: { label: "Zamknij", onClick: () => {} },
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [NETWORK_KEY, "devices"] });
      }, 5000);
    },
    onError: () => toast.error("Nie udało się uruchomić skanowania."),
  });
  return { triggerScan, isLoading };
};

export const useUpdateNetworkDeviceHostname = () => {
  const { mutateAsync: updateHostname, isPending: isLoading } = useMutation({
    mutationFn: ({ deviceId, hostname }: { deviceId: number; hostname: string }) =>
      updateNetworkDeviceHostnameApi(deviceId, hostname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NETWORK_KEY, "devices"] });
    },
    onError: () => toast.error("Błąd podczas aktualizacji hostname"),
  });
  return { updateHostname, isLoading };
};
