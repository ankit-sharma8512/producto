import { Typography, Flex, Button, Row, Table, Alert, Space, Popconfirm, App } from "antd";
import moment                                   from "moment";
import { Link, useLocation }                    from "react-router-dom";
import { usePurchaseList, useDeletePurchase }   from "../../hooks/purchase-api";
import useQueryParams                           from "../../hooks/useQueryParams";
import { useEffect }                            from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function PurchaseList() {
    const location                        = useLocation();
    const [searchParams, setSearchParams] = useQueryParams(new URLSearchParams(location.search));
    const {data, isLoading, isError}      = usePurchaseList(searchParams);
    const { page, limit }                 = searchParams;
    const deletePurchase                  = useDeletePurchase()
    const { message }                     = App.useApp()

    async function deleteP(id) {
        try {
            await deletePurchase.mutateAsync(id);
            message.success('Purchase deleted sucessfully');
        } catch {
            message.error('Failed to delete purchase')
        }
    }

    useEffect(() => {
        if (!page || !limit)
            setSearchParams({ page: 1, limit: 10 })
    }, [])

    const cols = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (v) => moment(v).format('DD-MM-YYYY'),
            align: 'center',
            width: 120
        },
        {
            title: 'Vendor Name',
            render: (_, row) => <Link to={'/purchase/' + row._id}>{(row.vendorId ? row.vendorId.name : row.vendor.name)}</Link>
        },
        {
            title: 'Vendor GSTIN',
            render: (_, row) => (row.vendorId ? row.vendorId.gstin : row.vendor.gstin) || '-',
            align: 'center',
            width: 240
        },
        {
            title: 'Vendor Contact',
            render: (_, row) => (row.vendorId ? row.vendorId.contact : row.vendor.contact) || '-',
            align: 'center',
            width: 150
        },
        {
            title: 'Amount (INR)',
            dataIndex: 'total',
            align: 'right',
            width: 150
        },
        {
            title: 'State',
            dataIndex: 'state',
            render: (val) => val.toUpperCase(),
            align: 'center',
            width: 150
        },
        {
            title: 'Action',
            dataIndex: '_id',
            align: 'center',
            render: (v, row) => (
                <Row justify='center'>
                    <Space>
                        <Link to={'/purchase/update/' + v}>
                            <Button size="small" icon={<EditOutlined />} disabled={row.state !== 'DRAFT'} />
                        </Link>
                        <Popconfirm title='Are you sure?' placement='bottomLeft' onConfirm={() => deleteP(v)}>
                            <Button size="small" icon={<DeleteOutlined />} danger disabled={row.state !== 'DRAFT'} />
                        </Popconfirm>
                    </Space>
                </Row>
            ),
            width: 160
        }
    ];

    if (isError)
        return <Alert type="error" title='Failed to load purchases' message='Failed to load purchases' />
    
    return (
        <>
            <Flex gap={20} style={{marginBottom:10}} justify="space-between">
                <Typography.Title level={3}>Purchases</Typography.Title>
                <Link to='/purchase/create'>
                    <Button
                        type = 'primary'
                        >
                        Make Purchase    
                    </Button>
                </Link>
            </Flex>
            <Table
                bordered
                columns    = {cols}
                loading    = {isLoading}
                dataSource = {data?.results || []}
                rowKey     = {r => r._id}
                pagination = {{
                    current  : data?.pagination?.page  || Number(page) || 1,
                    pageSize : data?.pagination?.limit || Number(limit) || 10,
                    total    : data?.pagination?.total || data?.results.length,
                    onChange : (page, limit) => setSearchParams({ page, limit }),
                    showTotal : (total, range) => `${range[0]}-${range[1]} of ${total} purchases`,
                    showSizeChanger : false,
                }}
            />
        </>
    )
}

export default PurchaseList