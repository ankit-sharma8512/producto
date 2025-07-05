import { useMutation, useQuery } from "react-query";
import { downloadPDF } from "../services/pdf";

export function useBillPDF(_id, options = {}) {
  const result = useQuery(['billpdf', _id], () => downloadPDF('/bill/pdf/' + _id), options)
  return result
}

export function useDeliveryNote(_id, options = {}) {
  const result = useQuery(['deliverynote', _id], () => downloadPDF('/bill/note/' + _id), options)
  return result
}

export function useStockPDF() {
  const mutation = useMutation(f => downloadPDF('/product/pdf?' + new URLSearchParams(f).toString()))
  return mutation
}

export function useSalePDF() {
  const mutation = useMutation(f => downloadPDF('/sale/pdf?' + new URLSearchParams(f).toString()))
  return mutation
}