import { Empty, Select, Spin } from "antd";
import { useRef } from "react";

function DebouncedSelect({ options, isFetching, isError, trigger, ...props }) {
  // trigger to refetch based on new value
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
    <Select
      showSearch
      filterOption={false}
      options={options || []}
      onSearch={debounce(trigger, 600)}
      notFoundContent={isFetching ? (isError ? <span>Some error occured</span> : <Spin size="small" />) : <Empty description='No result. Type to search new' styles={{ image: { height: '40px' } }} />}
      {...props}
    />
  )
}

export default DebouncedSelect