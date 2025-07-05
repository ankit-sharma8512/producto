import { useProductList } from "../../hooks/product-api"

function ProductList() {
//  	const { data, isFetching, isError } = useProductList(searchParams, { enabled: Boolean(page && size), keepPreviousData: true });

 	const { data, isFetching, isError } = useProductList();

	return (
		<span>{JSON.stringify(data)}</span>
	);
}

export default ProductList;
