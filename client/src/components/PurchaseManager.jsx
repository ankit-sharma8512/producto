import { Alert, App, Button, Card, Col, Flex, Form, InputNumber, Row, Switch, Table, Popconfirm, Space, Typography, DatePicker } from "antd";
import { useProductList } from '../hooks/product-api';
import DebouncedSelect from "./DebouncedSelect";
import { useState } from "react";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useAddPurchaseOrder, usePurchaseOrders, useRemovePurchaseOrder, useUpdatePurchaseOrder } from "../hooks/purchase-api";
import dayjs from "dayjs";

function ProductSearch({ onAdd, disable }) {
  const { message } = App.useApp()
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useState(null);
  const [productSelected, setProductSelected] = useState(null);
  const [form] = Form.useForm()
  const { data: prods, isFetching: isLoadingProd, isError: isErrorProd } = useProductList({ search, page: 1, size: 20 }, { enabled: Boolean(search), refetchOnWindowFocus: false })

  async function onFinish(data) {
    try {
      await onAdd(data);
      message.success('Order added sucessfully')
      reset()
    } catch (err) {
      if (err?.response?.data?.code === 'ERR_ORDER_ALREADY_PRESENT')
        return message.error('Order for this product is already present')
      message.error('Failed to add order')
    }
  }

  function handleValueChange(changed) {
    if (changed.pid) {
      const prod = prods?.result.find(p => p._id === changed.pid)
      setProductSelected(prod)
    }
  }

  function reset() {
    setProductSelected(null)
    form.resetFields()
  }

  return (
    <Card title='Add purchase order' size="small" extra={<Switch onChange={v => setEnabled(v)} disabled={disable} />}>
      <Form form={form} name='order-prod' onFinish={onFinish} onValuesChange={handleValueChange} disabled={!enabled || disable}>
        <Form.Item name='pid' rules={[{ required: true, message: 'Select a product and below fields to add' }]}>
          <DebouncedSelect
            allowClear
            options={prods?.result.map(b => ({ label: b.name + ` (MRP:Rs.${b.mrp}) (Brand:${b.brand})`, value: b._id }))}
            isFetching={isLoadingProd}
            isError={isErrorProd}
            trigger={v => setSearch(v)}
            placeholder='Search Products'
          />
        </Form.Item>
        <Flex>
          <Form.Item rules={[{ required: true }]} name='quantity' style={{ width: '33%' }}>
            <InputNumber placeholder="Quantity" style={{ width: '90%' }} />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} name='price' style={{ width: '33%' }} help={'MRP: ' + (productSelected?.mrp || '-') + (productSelected ? ' INR' : '')}>
            <InputNumber placeholder="Price" style={{ width: '90%' }} addonAfter={<span>INR</span>} />
          </Form.Item>
          <Form.Item name='mfgDate' style={{ width: '34%' }}>
            <DatePicker placeholder="Mfg Date" style={{ width: '90%' }} />
          </Form.Item>
          <Form.Item name='expDate' style={{ width: '34%' }}>
            <DatePicker placeholder="Exp Date" style={{ width: '100%' }} />
          </Form.Item>
        </Flex>
        <Flex gap={10} justify="end">
          <Button onClick={reset}>Reset</Button>
          <Button type='primary' htmlType="submit">Add</Button>
        </Flex>
      </Form>
    </Card>
  );
}

function UpdateOrderEntry({ val, onUpdate, display = v => v || '-', validation, msg, disable, k, pid, mode }) {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(val);
  const { message } = App.useApp()

  async function handleConfirm() {
    try {
      if (validation && !validation(value))
        throw message.error(msg || 'Invalid input')

      if (value !== val)
        await onUpdate({ [k]: value, pid });
    }
    catch {
      setValue(val)
    }
    finally {
      setEdit(false);
    }
  }

  return (
    <>
      {
        edit ?
          <Space>
            {mode === 'date' ?
              <DatePicker value={value} size="small" onChange={v => setValue(v)} style={{ width: '100%' }} /> :
              <InputNumber value={value} size="small" onChange={v => setValue(v)} style={{ width: '100%' }} />
            }
            <Button size="small" icon={<CheckOutlined />} type="dashed" onClick={handleConfirm} />
          </Space> :
          <Space>
            {display(val)}
            <Button size="small" icon={<EditOutlined />} type="dashed" onClick={() => setEdit(true)} disabled={disable} />
          </Space>
      }
    </>
  );
}

function OrderManager({ purchaseId, changeAllowed, total }) {
  const { data, isLoading, isError } = usePurchaseOrders(purchaseId);
  const addOrder = useAddPurchaseOrder(purchaseId);
  const removeOrder = useRemovePurchaseOrder(purchaseId);
  const updateOrder = useUpdatePurchaseOrder(purchaseId);
  const { message } = App.useApp()

  async function updOrder(data) {
    try {
      await updateOrder.mutateAsync(data);
      message.success('Order updated')
    } catch (err) {
      message.error('Failed to update order')
      throw err
    }
  }


  async function remOrder(pid) {
    try {
      await removeOrder.mutateAsync(pid);
      message.success('Order removed')
    } catch {
      message.error('Failed to remove order')
    }
  }

  async function onUpdate(data) {
    updOrder(data)
  }

  const cols = [
    {
      title: 'Brand',
      dataIndex: ['pid', 'brand'],
      align: 'center',
      width: 180
    },
    {
      title: 'Name',
      dataIndex: ['pid', 'name']
    },
    {
      title: 'MRP',
      align: 'right',
      dataIndex: ['pid', 'mrp'],
      width: 80
    },
    {
      title: 'Mfg Date',
      dataIndex: 'mfgDate',
      align: 'right',
      render: (v, row) => <UpdateOrderEntry k='mfgDate' pid={row.pid._id} val={v ? dayjs(v) : null} onUpdate={onUpdate} disable={!changeAllowed} mode='date' display={v => v ? dayjs(v).format('DD-MM-YYYY') : '-'} />,
      width: 150
    },
    {
      title: 'Exp Date',
      dataIndex: 'expDate',
      align: 'right',
      render: (v, row) => <UpdateOrderEntry k='expDate' pid={row.pid._id} val={v ? dayjs(v) : null} onUpdate={onUpdate} disable={!changeAllowed} mode='date' display={v => v ? dayjs(v).format('DD-MM-YYYY') : '-'} />,
      width: 150
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      align: 'right',
      render: (v, row) => <UpdateOrderEntry k='quantity' pid={row.pid._id} val={v} onUpdate={onUpdate} disable={!changeAllowed} />,
      width: 110
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'right',
      render: (v, row) => <UpdateOrderEntry
        k='price' pid={row.pid._id}
        val={v}
        onUpdate={onUpdate}
        validation={(v) => v <= row.pid.mrp}
        msg='Can not set more than MRP'
        disable={!changeAllowed}
      />,
      width: 130
    },
    {
      title: 'Remove',
      dataIndex: ['pid', '_id'],
      align: 'center',
      render: (v) => <Popconfirm title='Remove this order' placement="topLeft" onConfirm={() => remOrder(v)}><Button size="small" danger icon={<CloseOutlined />} disabled={!changeAllowed} /></Popconfirm>,
      width: 100
    },
  ];

  if (isError)
    return <Alert message='Failed to load purchase orders' />

  return (
    <Flex vertical gap={16}>
      <Row gutter={[10, 0]}>
        <Col span={16}>
          <ProductSearch onAdd={s => addOrder.mutateAsync(s)} disable={!changeAllowed} />
        </Col>
        <Col span={8}>
          <Card size="small" title='Purchase Total Amount (INR)' style={{ minHeight: '100%' }}>
            <Typography.Text>Total Paid: {(total || 0).toFixed(2)} INR</Typography.Text>
          </Card>
        </Col>
      </Row>
      <Table
        bordered
        size="small"
        columns={cols}
        dataSource={data}
        loading={isLoading}
        rowKey={r => r.pid._id}
        pagination={false}
      />
    </Flex>
  )
}

export default OrderManager