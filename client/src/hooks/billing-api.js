import { useMutation, useQuery, useQueryClient } from "react-query";
import { getBills, createBill, getBillDetail, updateBill, deleteBill, getBillOrders, addBillOrder, removeBillOrder, updateBillOrder, updateBillState, processBill, returnBill, addPayment } from '../services/billing';

export function useBillList(query, options) {
  const result = useQuery(['bill', query], () => getBills(query), options);

  return result;
}

export function useBillDetail(id, opts={}) {
  const result = useQuery(['bill', id], () => getBillDetail(id), { enabled: Boolean(id), ...opts });

  return result;
}

export function useBillOrders(id) {
  const result = useQuery(['bill', 'order', id], () => getBillOrders(id), { enabled: Boolean(id) });

  return result;
}

export function useCreateBill() {
  const queryClient = useQueryClient();

  const mutation = useMutation(createBill, {
    onSuccess: () => {
      queryClient.invalidateQueries('bill')
    }
  })

  return mutation
}

export function useAddBillOrder(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation((d) => addBillOrder(id, d), {
    onSuccess: () => {
      queryClient.invalidateQueries(['bill', 'order', id])
    }
  })

  return mutation
}

export function useUpdateBillOrder(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation((d) => updateBillOrder(id, d), {
    onSuccess: () => {
      queryClient.invalidateQueries(['bill', 'order', id])
    }
  })

  return mutation
}


export function useRemoveBillOrder(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation((pid) => removeBillOrder(id, pid), {
    onSuccess: () => {
      queryClient.invalidateQueries(['bill', 'order', id])
    }
  })

  return mutation
}

export function useDeleteBill() {
  const queryClient = useQueryClient();

  const mutation = useMutation(deleteBill, {
    onSuccess: () => {
      queryClient.invalidateQueries('bill')
    }
  })

  return mutation
}


export function useUpdateBill(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation(updateBill, {
    onSuccess: () => {
      queryClient.invalidateQueries('bill')
      queryClient.invalidateQueries(['bill', id])
    }
  })

  return mutation
}

export function useProcessBill(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation(() => processBill(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('bill')
      queryClient.invalidateQueries(['bill', id])
    }
  })

  return mutation
}

export function useReturnBill(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation(() => returnBill(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('bill')
      queryClient.invalidateQueries(['bill', id])
    }
  })

  return mutation
}

export function useAddPayment(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation((body) => addPayment(id, body), {
    onSuccess: () => {
      queryClient.invalidateQueries('bill')
      queryClient.invalidateQueries(['bill', id])
    }
  })

  return mutation
}


export function useUpdateBillState(id) {
  const queryClient = useQueryClient();

  const mutation = useMutation((s) => updateBillState(id, s), {
    onSuccess: () => {
      queryClient.invalidateQueries('bill')
      queryClient.invalidateQueries(['bill', id])
    }
  })

  return mutation
}
