import { App, Alert, Card, Divider, Flex, Spin, Typography, Button, Table, Space, Modal, Row, Popconfirm } from "antd";
import { useParams } from "react-router-dom"
import { useDeleteProductLot, useProductDetail, useProductLots } from "../../hooks/product-api"
import moment from "moment";
import { useState } from "react";
import AddLot from "./AddLot";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function Detail() {
  const { _id } = useParams()
  const { message } = App.useApp();
  const [isAddLotOpen, setIsAddLotOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(null);
  const deleteProductLot = useDeleteProductLot()
  const { data, isLoading, isError } = useProductDetail(_id);
  const { data: lots, isLoading: isLoadingLots, isError: isErrorLots } = useProductLots({ pid: _id });

  async function deleteLot(_id) {
    try {
      await deleteProductLot.mutateAsync(_id)
      message.success('Lot deleted sucessfully');
    }
    catch {
      message.error('Lot deletion failed');
    }
  }

  const cols = [
    {
      title: 'Purchased on',
      dataIndex: 'createdAt',
      render: (v_, row) => moment(row.purchaseDate || row.createdAt).format('DD/MM/YYYY hh:mm a'),
      width: 200
    },
    {
      title: 'Price (INR)',
      dataIndex: 'price',
      align: 'center'
    },
    {
      title: 'Mfg Date',
      dataIndex: 'mfgDate',
      render: (v) => v ? moment(v).format('MM/YYYY') : '-',
      align: 'center'
    },
    {
      title: 'Exp Date',
      dataIndex: 'expDate',
      render: (v) => v ? moment(v).format('MM/YYYY') : '-',
      align: 'center'
    },
    {
      title: 'Current Qty',
      dataIndex: 'quantity',
      align: 'center',
      width: 150
    },
    {
      title: 'Original Qty',
      dataIndex: 'originalQuantity',
      align: 'center',
      width: 150
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      key: 'name',
      align: 'center',
      width: 200,
      render: (_, row) => (
        <Row justify='center' style={{ gap: 10 }}>
          <Button icon={<EditOutlined />} onClick={() => setIsUpdateOpen(row)} />
          <Popconfirm placement="topLeft" title='Are you sure?' description='This action is irreversible and will completely delete this lot' onConfirm={() => deleteLot(row._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Row>
      )
    },
  ]

  if (isLoading)
    return <Spin />;

  if (isError)
    return <Alert type="error" message='Failed to load details' />

  return (
    <Card>
      <Flex justify="space-between">
        <div>
          <Title level={3}>{data.name}</Title>
          <Space>
            <Text>Brand: {data.brand}</Text>
            <Divider type="vertical" />
            <Text>MRP: {data.mrp}</Text>
          </Space>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Title level={4}>HSN: {data.hsn}</Title>
          <Text>Added on: {moment(data.createdAt).format('DD/MM/YYYY hh:mm a')}</Text>
        </div>
      </Flex>
      <Divider />
      {
        isErrorLots ?
          <Alert type="error" message='Failed to load lot details' /> :
          <>
            <Flex justify="space-between" style={{ marginBottom: 10 }}>
              <Space>
                <Title level={5}>Total Lots: {lots?.length}</Title>
                <Divider type="vertical" />
                <Title level={5}>Available Quantity: {lots?.reduce((agg, curr) => agg + curr.quantity, 0)}</Title>
              </Space>
              <Button type='primary' onClick={() => setIsAddLotOpen(true)}>Add Lot</Button>
            </Flex>
            <Table
              columns={cols}
              dataSource={lots || []}
              loading={isLoadingLots}
              rowKey={r => r._id}
              pagination={false}
            />
          </>
      }
      <Modal title={<Title level={4}>Add Product Lot</Title>} open={isAddLotOpen} onCancel={() => setIsAddLotOpen(false)} width='45vw' footer={null} maskClosable={false} destroyOnClose>
        <AddLot product={data} onClose={() => setIsAddLotOpen(false)} />
      </Modal>
      <Modal title={<Title level={4}>Update Product Lot</Title>} open={isUpdateOpen} onCancel={() => setIsUpdateOpen(false)} width='45vw' footer={null} maskClosable={false} destroyOnClose>
        <AddLot lot={isUpdateOpen} product={data} onClose={() => setIsUpdateOpen(false)} />
      </Modal>
    </Card>
  )
}

export default Detail