import { App, Alert, Button, Col, Row, Table, Flex, Popconfirm, Modal, Typography } from "antd"
import { useDeleteTrader, useVendorList } from "../../hooks/trader-api"
import useQueryParams from "../../hooks/useQueryParams";
import { useLocation } from "react-router-dom";
import DebouncedSearch from "../../components/DebouncedSearch";
import { useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CreateTrader from "./Create";

function Vendor() {
  const { message } = App.useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useQueryParams(new URLSearchParams(location.search));
  const { search } = searchParams;
  const { data, isFetching, isError } = useVendorList(searchParams);
  const deleteTrader = useDeleteTrader()

  async function deleteTrad(_id) {
    try {
      await deleteTrader.mutateAsync(_id);
      message.success('Vendor deleted successfully');

    }
    catch {
      message.error('Failed to delete vendor')
    }
  }

  const cols = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 400
    },
    {
      title: 'GSTIN',
      dataIndex: 'gstin',
      render: (v) => v || 'NA',
      align: 'center',
      width: 250
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      align: 'center',
      width: 150
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Actions',
      render: (_, row) => (
        <Flex justify="center" gap={10}>
          <Button icon={<EditOutlined />} onClick={() => setIsEditOpen(row)} />
          <Popconfirm title='Are you sure?' onConfirm={() => deleteTrad(row._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Flex>
      ),
      align: 'center'
    }
  ];

  if (isError)
    return <Alert type="error" title='Failed to load vendors' message='Failed to load vendors' />

  return (
    <>
      <Row justify='space-between' style={{ margin: '10px 0' }}>
        <Col span={10}>
          <DebouncedSearch defaultValue={search} placeholder="Search Vendors" onChange={e => setSearchParams({ search: e.target.value ?? undefined })} />
        </Col>
        <Button type="primary" onClick={() => setIsAddOpen(true)}>Add Vendor</Button>
      </Row>
      <Table
        bordered
        columns={cols}
        loading={isFetching}
        dataSource={(data || [])}
        rowKey={r => r._id}
        pagination={false}
      />
      <Modal title={<Typography.Title level={4}>Add Vendor</Typography.Title>} open={isAddOpen} onCancel={() => setIsAddOpen(false)} width='60vw' footer={null} maskClosable={false} destroyOnClose>
        <CreateTrader type='vendor' onClose={() => setIsAddOpen(false)} />
      </Modal>
      <Modal title={<Typography.Title level={4}>Edit Vendor</Typography.Title>} open={isEditOpen} onCancel={() => setIsEditOpen(false)} width='60vw' footer={null} maskClosable={false} destroyOnClose>
        <CreateTrader trader={isEditOpen} type='vendor' onClose={() => setIsEditOpen(false)} />
      </Modal>
    </>
  )
}

export default Vendor