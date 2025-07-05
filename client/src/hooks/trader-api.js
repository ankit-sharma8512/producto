import { useMutation, useQuery, useQueryClient } from "react-query";
import { addTrader, deleteTrader, getBuyers, getVendors, updateTrader } from "../services/trader";

export function useBuyerList(query, options = {}) {
  const result = useQuery(['buyer', query], () => getBuyers(query), options);

  return result;
}

export function useVendorList(query, options = {}) {
  const result = useQuery(['vendor', query], () => getVendors(query), options);

  return result;
}

export function useAddTrader() {
  const queryClient = useQueryClient();

  const mutation = useMutation(addTrader, {
    onSuccess: (_, args) => {
      queryClient.invalidateQueries(args.type)
    }
  })

  return mutation;
}

export function useUpdateTrader() {
  const queryClient = useQueryClient();

  const mutation = useMutation(updateTrader, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(data.data.type)
    }
  })

  return mutation;
}

export function useDeleteTrader() {
  const queryClient = useQueryClient();

  const mutation = useMutation(deleteTrader, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(data.data.type)
    }
  })

  return mutation;
}