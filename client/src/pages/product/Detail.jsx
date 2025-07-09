import { useParams, Link, useNavigate } from "react-router-dom"
import { useProductDetail, useProductLots, useDeleteProduct } from "../../hooks/product-api"
import { Alert, Divider, Flex, Skeleton, Space, Typography, Table, Button, Popconfirm, App } from "antd";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";


function ProductDetail() {
    const { id }                                                         = useParams()
    const { data, isLoading, isError }                                   = useProductDetail(id);
    const deleteProduct                                                  = useDeleteProduct();
    const { data: lots, isLoading: isLoadingLots, isError: isErrorLots } = useProductLots({ pid: id });
    const navigate                                                       = useNavigate()
    const {message}                                                      = App.useApp();

    async function deleteProd() {
        try {
            await deleteProduct.mutateAsync(id)
            message.success('Product deleted sucessfully');
            navigate(-1)
        }
        catch {
            message.error('Product deletion failed');
        }
    }
    
    const cols = [
        {
            title     : 'Purchase ID',
            dataIndex : 'purchaseid',
            render    : (v, row) => <Link>{v}</Link>,
            align     : 'center'
        },
        {
            title     : 'Purchased on',
            dataIndex : 'created_at',
            render    : (v, row) => moment(row.date || v).format('DD/MM/YYYY'),
            align     : 'center'
        },
        {
            title     : 'Price (INR)',
            dataIndex : 'price',
            align     : 'center'
        },
        {
            title     : 'Mfg Date',
            dataIndex : 'mfgdate',
            render    : (v) => v ? moment(v).format('MM/YYYY') : '-',
            align     : 'center'
        },
        {
            title     : 'Exp Date',
            dataIndex : 'expdate',
            render    : (v) => v ? moment(v).format('MM/YYYY') : '-',
            align     : 'center'
        },
        {
            title     : 'Exp Date',
            dataIndex : 'expdate',
            render    : (v) => v ? moment(v).format('MM/YYYY') : '-',
            align     : 'center'
        },
        {
            title     : 'Quantity Purchased',
            dataIndex : 'quantity',
            align     : 'center'
        }
      ]

    if(isLoading)
        return <Skeleton active/>

    if(isError)
        return <Alert type="error" message="Failed to load product"/>

    return (
        <>
            <Flex justify="space-between">
                <div>
                    <Typography.Title level={3}>{data.name}</Typography.Title>
                    <Space style={{paddingTop:10}}>
                        <Typography.Text>Brand: {data.brand}</Typography.Text>
                        <Divider type="vertical" />
                        <Typography.Text>HSN: {data.hsn}</Typography.Text>
                        <Divider type="vertical" />
                        <Typography.Text>MRP: {data.mrp}</Typography.Text>
                        <Divider type="vertical" />
                        <Typography.Text>Added on: {moment(data.created_at).format('DD/MM/YYYY hh:mm a')}</Typography.Text>
                    </Space>
                </div>
                <Flex gap={10} align="center">
                    <Link to={'/product/update/'+id}><Button icon={<EditOutlined/>}/></Link>
                    <Popconfirm title='Delete this product' description='This is irreversible' onConfirm={deleteProd} placement="bottomLeft">
                        <Button icon={<DeleteOutlined/>} danger/>
                    </Popconfirm>
                </Flex>
            </Flex>
            <Divider />
            <Typography.Title level={4} style={{marginBottom:10}}>Purchase Lots</Typography.Title>
            {
                isErrorLots ?
                <Alert type="error" message="Failed to load product lots" /> :
                <Table
                    columns    = {cols}
                    dataSource = {lots}
                    loading    = {isLoadingLots}
                    rowKey     = {r => r.id}
                    pagination = {false}
                />
            }
        </>
    )
}

export default ProductDetail;