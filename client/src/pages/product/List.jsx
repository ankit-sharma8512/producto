import { Button, Divider, List, Flex, Typography, Spin, Alert }  from "antd";
import SkeletonLoader     from '../../components/SkeletonLoader';
import { useProductList } from "../../hooks/product-api"
import { Link, useLocation }           from "react-router-dom";
import DebouncedSearch    from "../../components/DebouncedSearch";
import useQueryParams     from "../../hooks/useQueryParams";
import ProductAvailable from "../../components/ProductAvailable";
import { useEffect } from "react";

function ProductList() {
	const location                        = useLocation();
	const [searchParams, setSearchParams] = useQueryParams(new URLSearchParams(location.search));
	const { search, page, limit }         = searchParams;
	const { data, isFetching, isError }   = useProductList(searchParams, { enabled: Boolean(page && limit) });

	useEffect(() => {
		if (!page || !limit)
			setSearchParams({ page: 1, limit: 10 })
	}, [])

	if(isError)
        return <Alert type="error" message="Failed to load products"/>

	const body = (
		(isFetching && !data) ?
		<SkeletonLoader/> :
		<List
			rowKey     = {row => row.id}
			dataSource = {data?.results}
			renderItem = {prod => (
				<List.Item
					actions={[
						<ProductAvailable id={prod.id}/>
					]}
				>
					<List.Item.Meta
						title  = {<Link to={'/product/'+prod.id}>{prod.name}</Link>}
						description = {"Brand: " + prod.brand}
						/>
					<div>
						<span>MRP: {prod.mrp} INR</span>
						<Divider type="vertical"/>
						<span>HSN: {prod.hsn}</span>
					</div>
				</List.Item>
			)}
			pagination = {{
				current         : Number(page)  || data?.pagination.page || 1,
				pageSize        : Number(limit) || data?.pagination.limit || 10,
				total           : data?.pagination.total || data?.results.length,
				onChange        : (page, limit) => setSearchParams({ page, limit }),
				showSizeChanger : false,
				showTotal       : (total, range) => `${range[0]}-${range[1]} of ${total} products`
			}}
		/>
	)

	return (
		<>
			<Flex gap={20} style={{marginBottom:10}}  justify="space-between">
				<DebouncedSearch
					defaultValue = {search}
					placeholder  = "Search Product"
					onChange     = {e => setSearchParams({ search: e.target.value ?? undefined })}
				/>
				<Link to='/product/create'>
					<Button
						type = 'primary'
						>
						Add Product
					</Button>
				</Link>
			</Flex>
			{body}
		</>
	);
}

export default ProductList;
