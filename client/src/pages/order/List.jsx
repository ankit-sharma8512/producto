import { Link, useLocation } from "react-router-dom";
import useQueryParams  from "../../hooks/useQueryParams";
import { useEffect }   from "react";
import { useBillList } from "../../hooks/billing-api";
import DebouncedSearch from "../../components/DebouncedSearch";
import { Alert, Button, Flex, Table } from "antd";
import moment from "moment";

function OrderList() {
    const location                              = useLocation();
    const [searchParams, setSearchParams]       = useQueryParams(new URLSearchParams(location.search));
    const { page, limit, search }               = searchParams;
    const { data, isFetching, isIdle, isError } = useBillList(searchParams, { enabled: Boolean(page && limit), keepPreviousData: true });

    useEffect(() => {
        if (!page || !limit)
          setSearchParams({ page: 1, limit: 10 })
      }, []);

    const cols = [
        {
            title     : 'Bill No.',
            dataIndex : 'billNo',
            render    : (val, row) => <Link to={'/order/' + row._id}>{val}</Link>,
            align     : 'center',
            width     : 180
        },
        {
            title     : 'Bill Date',
            dataIndex : 'date',
            render    : (v) => moment(v).format('DD-MM-YYYY'),
            align     : 'center',
            width     : 120
        },
        {
            title         : 'Buyer Name',
            render        : (_, row) => (row.buyerId ? row.buyerId.name : row.buyer.name)
        },
        {
            title: 'Buyer Contact',
            render: (_, row) => (row.buyerId ? row.buyerId.contact : row.buyer.contact) || '-',
            align: 'center',
            width: 150
        },
        {
            title     : 'State',
            dataIndex : 'state',
            render    : (val) => val.toUpperCase(),
            align     : 'center',
            width     : 180
        },
        // {
        //     title: 'Action',
        //     dataIndex: '_id',
        //     align: 'center',
        //     render: (v, row) => (
        //     <Row justify='center'>
        //     <Space>
        //     <Link to={'/billing/update/' + v}>
        //     <Button icon={<EditOutlined />} disabled={row.state !== 'draft'} />
        //     </Link>
        //     <Popconfirm title='Are you sure?' placement='bottomLeft' onConfirm={() => deleteB(v)}>
        //     <Button icon={<DeleteOutlined />} danger disabled={row.state !== 'draft'} />
        //     </Popconfirm>
        //     </Space>
        //     </Row>
        //     ),
        //     width: 180
        // }
    ];

    if(isError)
        return <Alert type="error" message='Failed to load orders' />

    return(
        <>
            <Flex gap={20} style={{marginBottom:10}} justify="space-between">
                <DebouncedSearch defaultValue={search} placeholder="Search Bill Number" onChange={e => setSearchParams({ search: e.target.value ?? undefined, page: 1 })} />

                <Link to='/order/create'>
                    <Button type = 'primary'>
                        Create Order    
                    </Button>
                </Link>
            </Flex>
            <Table
                bordered
                columns    = {cols}
                loading    = {isFetching || isIdle}
                dataSource = {data?.results || []}
                rowKey     = {r => r._id}
                pagination={{
                    current  : data?.pagination?.page  || Number(page) || 1,
                    pageSize : data?.pagination?.limit || Number(limit) || 10,
                    total    : data?.pagination?.total || data?.results.length,
                    onChange : (page, limit) => setSearchParams({ page, limit }),
                    showTotal : (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
                    showSizeChanger : false,
                }}
            />
        </>
    )
}

export default OrderList