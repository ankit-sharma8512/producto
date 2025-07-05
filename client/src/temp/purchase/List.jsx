import { Link, useLocation } from "react-router-dom";
import { Button, Row, Table, Col, Alert, Flex, Space, Popconfirm, App, Typography } from "antd";
import moment from "moment";
import { useEffect } from "react";
import useQueryParams from "../../hooks/useQueryParams";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDeletePurchase, usePurchaseList } from "../../hooks/purchase-api";

function PurchaseList() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useQueryParams(new URLSearchParams(location.search));
  const { page, size } = searchParams;
  const { data, isFetching, isIdle, isError } = usePurchaseList(searchParams, { enabled: Boolean(page && size), keepPreviousData: true });
  const deletePurchase = useDeletePurchase()
  const { message } = App.useApp();

  async function deleteP(id) {
    try {
      await deletePurchase.mutateAsync(id);
      message.success('Purchase deleted sucessfully');
    } catch {
      message.error('Failed to delete purchase')
    }
  }

  useEffect(() => {
    if (!page || !size)
      setSearchParams({ page: 1, size: 10 })
  }, [])

  const cols = [
    {
      title: 'Date',
      dataIndex: 'purchaseDate',
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
              <Button icon={<EditOutlined />} disabled={row.state !== 'draft'} />
            </Link>
            <Popconfirm title='Are you sure?' placement='bottomLeft' onConfirm={() => deleteP(v)}>
              <Button icon={<DeleteOutlined />} danger disabled={row.state !== 'draft'} />
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
      <Row justify='space-between' style={{ margin: '10px 0' }} align={'middle'}>
        <Col span={10}>
          <Typography.Title level={4} style={{ margin: 0, paddingLeft: 10 }}>Purchase List</Typography.Title>
          {/* <DebouncedSearch defaultValue={search} placeholder="Search Bill Number" onChange={e => setSearchParams({ search: e.target.value ?? undefined, page: 1 })} /> */}
        </Col>
        <Flex gap={10}>
          <Link to='/purchase/create'>
            <Button type="primary">Add Purchase</Button>
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

export default PurchaseList
