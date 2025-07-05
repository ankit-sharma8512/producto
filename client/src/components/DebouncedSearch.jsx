import { Input } from "antd"
import { useRef } from "react"

function DebouncedSearch({ defaultValue, placeholder, onChange }) {
  const timerID = useRef(null);

  function debounce(func, delay) {
    return function (...v) {
      if (timerID.current)
        clearTimeout(timerID.current);

      timerID.current = setTimeout(() => {
        func(...v);
        timerID.current = null;
      }, delay);
    }
  }

  return (
    <Input.Search
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={debounce(onChange, 500)}
    />
  )
}

export default DebouncedSearch