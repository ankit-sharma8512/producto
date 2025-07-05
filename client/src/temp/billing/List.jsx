import { Link, useLocation } from "react-router-dom";
import { Button, Row, Table, Col, Alert, Flex, Space, Popconfirm, App } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useBillList, useDeleteBill } from "../../hooks/billing-api"
import useQueryParams from "../../hooks/useQueryParams";
import DebouncedSearch from "../../components/DebouncedSearch";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function BillingList() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useQueryParams(new URLSearchParams(location.search));
  const { page, size, search } = searchParams;
  const { data, isFetching, isIdle, isError } = useBillList(searchParams, { enabled: Boolean(page && size), keepPreviousData: true });
  const deleteBill = useDeleteBill()
  const { message } = App.useApp();

  async function deleteB(id) {
    try {
      await deleteBill.mutateAsync(id);
      message.success('Bill deleted sucessfully');
    } catch {
      message.error('Failed to delete bill')
    }
  }

  useEffect(() => {
    if (!page || !size)
      setSearchParams({ page: 1, size: 10 })
  }, [])

  const cols = [
    {
      title: 'Bill No.',
      dataIndex: 'billNo',
      key: 'billNo',
      render: (val, row) => <Link to={'/billing/' + row._id}>{val}</Link>,
      align: 'center',
      width: 180
    },
    {
      title: 'Bill Date',
      dataIndex: 'billDate',
      render: (v) => moment(v).format('DD-MM-YYYY'),
      align: 'center',
      width: 120
    },
    {
      title: 'Buyer Name',
      render: (_, row) => (row.buyerId ? row.buyerId.name : row.buyer.name)
    },
    {
      title: 'Buyer GSTIN',
      render: (_, row) => (row.buyerId ? row.buyerId.gstin : row.buyer.gstin) || '-',
      align: 'center',
      width: 260
    },
    {
      title: 'Buyer Contact',
      render: (_, row) => (row.buyerId ? row.buyerId.contact : row.buyer.contact) || '-',
      align: 'center',
      width: 150
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'billNo',
      render: (val) => val.toUpperCase(),
      align: 'center',
      width: 180
    },
    {
      title: 'Action',
      dataIndex: '_id',
      align: 'center',
      render: (v, row) => (
        <Row justify='center'>
          <Space>
            <Link to={'/billing/update/' + v}>
              <Button icon={<EditOutlined />} disabled={row.state !== 'draft'} />
            </Link>
            <Popconfirm title='Are you sure?' placement='bottomLeft' onConfirm={() => deleteB(v)}>
              <Button icon={<DeleteOutlined />} danger disabled={row.state !== 'draft'} />
            </Popconfirm>
          </Space>
        </Row>
      ),
      width: 180
    }
  ];

  if (isError)
    return <Alert type="error" title='Failed to load bills' message='Failed to load bills' />

  return (
    <>
      <Row justify='space-between' style={{ margin: '10px 0' }}>
        <Col span={10}>
          <DebouncedSearch defaultValue={search} placeholder="Search Bill Number" onChange={e => setSearchParams({ search: e.target.value ?? undefined, page: 1 })} />
        </Col>
        <Flex gap={10}>
          <Link to='/billing/create'>
            <Button type="primary">Create Bill</Button>
          </Link>
        </Flex>
      </Row>
      <Table
        bordered
        columns={cols}
        loading={isFetching || isIdle}
        dataSource={data?.result || []}
        rowKey={r => r._id}
        pagination={{
          current: Number(page) || data?.currentPage || 1,
          pageSize: Number(size) || data?.pageSize || 1,
          total: data?.totalCount || data?.result.length,
          onChange: (page, size) => setSearchParams({ page, size }),
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
      />
    </>
  )
}

export default BillingList