import { Link, useLocation } from "react-router-dom";
import { useDeleteProduct, useProductList } from "../../hooks/product-api"
import { useEffect, useState } from "react";
import { Button, Row, Table, Col, Alert, Modal, Typography, Flex, App, Popconfirm } from "antd";
import Create from "./Create";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import DebouncedSearch from "../../components/DebouncedSearch";
import useQueryParams from "../../hooks/useQueryParams";
import ProductLotInfo from "../../components/ProductLotInfo";
import AddLot from "./AddLot";

function Product() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddLotOpen, setIsAddLotOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(null);
  const { message } = App.useApp();
  // const [isProductListOpen, setProductListOpen] = useState(false);
  const deleteProduct = useDeleteProduct()

  const location = useLocation();
  const [searchParams, setSearchParams] = useQueryParams(new URLSearchParams(location.search));
  const { page, size, search } = searchParams;
  const { data, isFetching, isError, isIdle } = useProductList(searchParams, { enabled: Boolean(page && size), keepPreviousData: true });

  useEffect(() => {
    if (!page || !size)
      setSearchParams({ page: 1, size: 10 })
  }, [])

  async function deleteProd(_id) {
    try {
      await deleteProduct.mutateAsync(_id)
      message.success('Product deleted sucessfully');
    }
    catch {
      message.error('Product deletion failed');
    }
  }

  const cols = [
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: '_id',
      align: 'center',
      width: 140
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: '_id',
      render: (v, { _id }) => <Link to={'/product/' + _id}>{v}</Link>
    },
    {
      title: 'HSN Code',
      dataIndex: 'hsn',
      key: '_id',
      align: 'center',
      width: 150
    },
    {
      title: 'MRP (INR)',
      dataIndex: 'mrp',
      align: 'center',
      width: 150
    },
    {
      title: 'Lot Information',
      dataIndex: '_id',
      key: '_id',
      align: 'center',
      width: 350,
      render: (v) => <ProductLotInfo pid={v} />
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      key: 'name',
      align: 'center',
      width: 200,
      render: (_, row) => (
        <Row justify='center' style={{ gap: 10 }}>
          <Button icon={<PlusOutlined />} onClick={() => setIsAddLotOpen(row)} />
          <Button icon={<EditOutlined />} onClick={() => setIsUpdateOpen(row)} />
          <Popconfirm title='Are you sure?' description='This action is irreversible and will completely delete this product and its lots' onConfirm={() => deleteProd(row._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Row>
      )
    },
  ];
	if(isFetching)
		return null;

  if (isError)
    return <Alert type="error" title='Failed to load products' message='Failed to load products' />

  return (
    <>
      <Row justify='space-between' style={{ margin: '10px 0' }}>
        <Col span={10}>
          <DebouncedSearch defaultValue={search} placeholder="Search Products" onChange={e => setSearchParams({ search: e.target.value ?? undefined, page: 1 })} />
        </Col>
        <Flex gap={10}>
          <Button type="primary" onClick={() => setIsAddOpen(true)}>Add Product</Button>
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
      <Modal title={<Typography.Title level={4}>Add Product</Typography.Title>} open={isAddOpen} onCancel={() => setIsAddOpen(false)} width='55vw' footer={null} maskClosable={false} destroyOnClose>
        <Create onClose={() => setIsAddOpen(false)} />
      </Modal>
      <Modal title={<Typography.Title level={4}>Update Product</Typography.Title>} open={isUpdateOpen} onCancel={() => setIsUpdateOpen(false)} width='55vw' footer={null} maskClosable={false} destroyOnClose>
        <Create product={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} />
      </Modal>
      <Modal title={<Typography.Title level={4}>Add Product Lot</Typography.Title>} open={isAddLotOpen} onCancel={() => setIsAddLotOpen(false)} width='45vw' footer={null} maskClosable={false} destroyOnClose>
        <AddLot product={isAddLotOpen} onClose={() => setIsAddLotOpen(false)} />
      </Modal>
    </>
  )
}

export default Product
