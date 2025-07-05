import { Button, Divider, Space, Spin, Typography } from "antd";
import { useProductLots } from "../hooks/product-api"
import { RedoOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;

function ProductLotInfo({ pid }) {
  const { data, isFetching, isError, refetch, isIdle } = useProductLots({ pid }, { enabled: false });

  if (isFetching)
    return <Spin />;

  if (isError)
    return <Link type="danger" onClick={refetch}>Failed to load. Click to try again</Link>;

  if (!data && isIdle)
    return <Link onClick={refetch}>Click to view information</Link>

  return (
    <Space size='small'>
      <Text>Quantity: {data?.reduce((agg, curr) => agg + curr.quantity, 0)}</Text>
      <Divider type="vertical" />
      <Text>Total Lots: {data?.length}</Text>
      <Button loading={isFetching} icon={<RedoOutlined />} onClick={refetch} size="small" />
    </Space>
  );
}

export default ProductLotInfo