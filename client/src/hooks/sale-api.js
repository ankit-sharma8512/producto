import { useMutation, useQuery, useQueryClient } from "react-query";
import { getSale, updateSale } from "../services/sale";

export function useSale(id) {
  const result = useQuery(['sale', id], () => getSale(id), { enabled: Boolean(id) });

  return result;
}

export function useSaleUpdate(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation((s) => updateSale(id, s), {
    onSuccess: () => {
      queryClient.invalidateQueries(['sale', id])
    }
  })

  return mutation
}
