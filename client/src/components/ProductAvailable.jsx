import { ReloadOutlined } from "@ant-design/icons";
import { Button, Spin, Typography, Badge } from "antd";

import { useProductAvailable } from "../hooks/product-api"

function ProductAvailable({id, status, limit=0}) {
    const {data, isFetching, isError, refetch} = useProductAvailable(id, {enabled:Boolean(status)});

    if(isFetching)
        return <Spin size="small"/>

    if (isError)
        return <Link type="danger" onClick={refetch}>Failed to load. Click to try again</Link>;

    if(data) {
        if(status) return <Badge color={data.available >= limit ? 'green' : 'red'} />;
    
        return <span>Available: {data.available || 0} <Button size="small" icon={<ReloadOutlined/>} onClick={refetch}/></span>
    }

    return (
        <Typography.Link onClick={refetch}>View Available</Typography.Link>
    );
}

export default ProductAvailable;