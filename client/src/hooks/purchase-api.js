import { useMutation, useQuery, useQueryClient } from "react-query";
import { addPurchaseOrder, completePurchase, createPurchase, deletePurchase, getPurchaseDetail, getPurchaseOrders, getPurchases, removePurchaseOrder, updatePurchase, updatePurchaseOrder } from "../services/purchase";

export function usePurchaseList(query, options) {
  const result = useQuery(['purchase', query], () => getPurchases(query), options);

  return result;
}

export function usePurchaseDetail(id) {
  const result = useQuery(['purchase', id], () => getPurchaseDetail(id), { enabled: Boolean(id) });

  return result;
}

export function usePurchaseOrders(id) {
  const result = useQuery(['purchase', 'order', id], () => getPurchaseOrders(id), { enabled: Boolean(id) });

  return result;
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  const mutation = useMutation(createPurchase, {
    onSuccess: () => {
      queryClient.invalidateQueries('purchase')
    }
  })

  return mutation
}

export function useAddPurchaseOrder(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation((d) => addPurchaseOrder(id, d), {
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase', 'order', id])
    }
  })

  return mutation
}

export function useUpdatePurchaseOrder(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation((d) => updatePurchaseOrder(id, d), {
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase', 'order', id])
    }
  })

  return mutation
}


export function useRemovePurchaseOrder(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation((pid) => removePurchaseOrder(id, pid), {
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase', 'order', id])
    }
  })

  return mutation
}

export function useDeletePurchase() {
  const queryClient = useQueryClient();

  const mutation = useMutation(deletePurchase, {
    onSuccess: () => {
      queryClient.invalidateQueries('purchase')
    }
  })

  return mutation
}


export function useUpdatePurchase(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation(updatePurchase, {
    onSuccess: () => {
      queryClient.invalidateQueries('purchase')
      queryClient.invalidateQueries(['purchase', id])
    }
  })

  return mutation
}

export function useCompletePurchase(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation(() => completePurchase(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('purchase')
      queryClient.invalidateQueries(['purchase', id])
    }
  })

  return mutation
}
