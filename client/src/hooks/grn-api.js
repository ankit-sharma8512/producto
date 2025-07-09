import { useMutation, useQuery, useQueryClient } from "react-query";
import { createGrn, getGrnList } from "../services/grn";

export function useGRNList(query, options) {
  const result = useQuery(['grn', query], () => getGrnList(query), options);

  return result;
}

export function useCreateGRN() {
  const queryClient = useQueryClient();

  const mutation = useMutation(createGrn, {
    onSuccess: () => {
      queryClient.invalidateQueries('grn')
    }
  })

  return mutation
}