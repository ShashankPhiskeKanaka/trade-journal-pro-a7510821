import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tradeApi } from "@/api/client";
import { TradeCreatePayload } from "@/types/trade";

export function useTrades() {
  return useQuery({
    queryKey: ["trades"],
    queryFn: tradeApi.getAll,
    retry: 1,
  });
}

export function useTrade(id: string) {
  return useQuery({
    queryKey: ["trades", id],
    queryFn: () => tradeApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TradeCreatePayload) => tradeApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trades"] }),
  });
}

export function useDeleteTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tradeApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trades"] }),
  });
}
