import { useSearchParams } from "react-router-dom";

function useQueryParams(initial) {
  const [searchParams, setSearchParams] = useSearchParams(initial);

  function updateSearchParams(val) {
    setSearchParams(s => {
      const newParams = new URLSearchParams(s);

      for (const k in val) {
        if (!val[k])
          newParams.delete(k);
        else
          newParams.set(k, val[k]);
      }

      return newParams;
    })
  }

  return [Object.fromEntries(searchParams), updateSearchParams];
}

export default useQueryParams;