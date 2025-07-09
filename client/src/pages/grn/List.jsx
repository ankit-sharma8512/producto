import { useLocation } from "react-router-dom";
import {useGRNList } from "../../hooks/grn-api"
import useQueryParams from "../../hooks/useQueryParams";
import { useEffect } from "react";
import { Alert, Table } from "antd";
import CreateGRN from "./Create";
import moment from "moment";

function GRNList() {
    const location                              = useLocation();
    const [searchParams, setSearchParams]       = useQueryParams(new URLSearchParams(location.search));
    const { page, limit }                       = searchParams;
    const { data, isFetching, isError }         = useGRNList(searchParams)

    useEffect(() => {
        if (!page || !limit)
            setSearchParams({ page: 1, limit: 10 })
    }, []);

    const cols = [
        {
            title     : 'GRN ID',
            dataIndex : 'id',
            align     : 'center',
            width     : 320,
        },
        {
            title     : 'Product Brand',
            dataIndex : 'brand',
            align     : 'center',
            width     : 180,
        },
        {
            title     : 'Product Name',
            dataIndex : 'name',
        },
        {
            title     : 'Quantity',
            dataIndex : 'quantity',
            align     : 'center',
            width     : 100,
        },
        {
            title     : 'Type',
            dataIndex : 'type',
            align     : 'center',
            width     : 120,
        },
        {
            title     : 'Created at',
            dataIndex : 'created_at',
            render    : v => moment(v).format('DD/MM/YYYY hh:mm a'),
            align     : 'center',
            width     : 200,
        }
    ]

    if(isError)
        return <Alert type="error" message='Failed to load GRNs' />

    return (
        <>
            <CreateGRN />
            <Table
                bordered
                columns    = {cols}
                loading    = {isFetching}
                dataSource = {data?.results || []}
                rowKey     = {r => r.id}
                pagination={{
                    current  : data?.pagination?.page  || Number(page) || 1,
                    pageSize : data?.pagination?.limit || Number(limit) || 10,
                    total    : data?.pagination?.total || data?.results.length,
                    onChange : (page, limit) => setSearchParams({ page, limit }),
                    showTotal : (total, range) => `${range[0]}-${range[1]} of ${total} GRNs`,
                    showSizeChanger : false,
                }}
            />
        </>
    )
}

export default GRNList;