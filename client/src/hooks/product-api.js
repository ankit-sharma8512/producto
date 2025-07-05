import { useMutation, useQuery, useQueryClient } from "react-query";
import { addLot, addProduct, deleteProduct, deleteProductLot, getProductDetail, getProductLots, getProducts, updateProduct, updateProductLot } from "../services/product";

export function useProductList(query, options = {}) {
  const result = useQuery(['product', query], () => getProducts(query), options);

  return result;
}

export function useProductDetail(id) {
  const result = useQuery(['product', id], () => getProductDetail(id));

  return result;
}

export function useProductLots(query, options = {}) {
  const result = useQuery(['product_lots', query], () => getProductLots(query), options);

  return result;
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  const mutation = useMutation(addProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('product')
    }
  })

  return mutation;
}

export function useAddLot() {
  const queryClient = useQueryClient();

  const mutation = useMutation(addLot, {
    onSuccess: () => {
      queryClient.invalidateQueries('product_lots')
    }
  })

  return mutation;
}


export function useUpdateProduct() {
  const queryClient = useQueryClient();

  const mutation = useMutation(updateProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('product')
    }
  })

  return mutation
}

export function useUpdateProductLot() {
  const queryClient = useQueryClient();

  const mutation = useMutation(updateProductLot, {
    onSuccess: () => {
      queryClient.invalidateQueries('product_lots')
    }
  })

  return mutation
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const mutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('product')
    }
  })

  return mutation
}

export function useDeleteProductLot() {
  const queryClient = useQueryClient();

  const mutation = useMutation(deleteProductLot, {
    onSuccess: () => {
      queryClient.invalidateQueries('product_lots')
    }
  })

  return mutation
}