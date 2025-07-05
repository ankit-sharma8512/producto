import { Alert, App, Button, Card, Col, Flex, Form, InputNumber, Row, Spin, Switch, Table, Popconfirm, Space, Badge } from "antd";
import { useAddBillOrder, useBillOrders, useRemoveBillOrder, useUpdateBillOrder } from "../hooks/billing-api"
import { useProductList, useProductLots } from '../hooks/product-api';
import DebouncedSelect from "./DebouncedSelect";
import { useMemo, useState } from "react";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";

function ProductSearch({ onAdd, disable }) {
  const { message } = App.useApp()
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useState(null);
  const [productSelected, setProductSelected] = useState(null);
  const [form] = Form.useForm()
  const pid = Form.useWatch('pid', form);
  const { data: prods, isFetching: isLoadingProd, isError: isErrorProd } = useProductList({ search, page: 1, size: 20 }, { enabled: Boolean(search), refetchOnWindowFocus: false })
  const { data: lots, isFetching: isLoadingLots } = useProductLots({ pid, count: true }, { enabled: Boolean(pid) })

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
      console.log(prod)
      setProductSelected(prod)
      form.setFieldValue('rate', prod.mrp)
      form.setFieldValue('discount', 35);
    }
  }

  function reset() {
    setProductSelected(null)
    form.resetFields()
  }

  const available = useMemo(() => (lots?.reduce((agg, curr) => agg + curr.quantity, 0) || null), [lots])

  return (
    <Card title='Add product order' size="small" extra={<Switch onChange={v => setEnabled(v)} disabled={disable} />}>
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
          <Form.Item rules={[{ required: true }]} name='quantity' style={{ width: '33%' }} help={'Available: ' + (isLoadingLots ? <Spin size="small" /> : (available || '-'))}>
            <InputNumber placeholder="Quantity" style={{ width: '90%' }} />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} name='rate' style={{ width: '33%' }} help={'MRP: ' + (productSelected?.mrp || '-') + (productSelected ? ' INR' : '')}>
            <InputNumber placeholder="Rate (GST inc)" style={{ width: '90%' }} addonAfter={<span>INR</span>} />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} name='discount' style={{ width: '34%' }} help={`CGST: 9% | SGST: 9%`}>
            <InputNumber placeholder="Discount" style={{ width: '100%' }} addonAfter={<span>%</span>} />
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

function UpdateOrderEntry({ val, onUpdate, display = v => v, validation, msg, disable, k, pid }) {
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
            <InputNumber value={value} size="small" onChange={v => setValue(v)} style={{ width: '100%' }} />
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

function OrderManager({ billId, changeAllowed, returnAllowed }) {
  const { data, isLoading, isError } = useBillOrders(billId);
  const addOrder = useAddBillOrder(billId);
  const removeOrder = useRemoveBillOrder(billId);
  const updateOrder = useUpdateBillOrder(billId);
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
      title: "Sl.No.",
      render: (_, __, i) => i + 1,
      width: 60
    },
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
      title: 'Available',
      align: 'right',
      dataIndex: 'available',
      width: 100
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      align: 'right',
      render: (v, row) => <UpdateOrderEntry k='quantity' pid={row.pid._id} val={v} onUpdate={onUpdate} disable={!changeAllowed} />,
      width: 110
    },
    {
      title: 'Status',
      align: 'center',
      dataIndex: 'available',
      render: (_, row) => (<Badge color={row.available >= row.quantity ? 'green' : 'red'} />),
      width: 50
    },
    {
      title: 'Rate (GST inc)',
      dataIndex: 'rate',
      align: 'right',
      render: (v, row) => <UpdateOrderEntry
        k='rate' pid={row.pid._id}
        display={v => v.toFixed(2)}
        val={v}
        onUpdate={onUpdate}
        validation={(v) => v <= row.pid.mrp}
        msg='Can not set more than MRP'
        disable={!changeAllowed}
      />,
      width: 130
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discount',
      align: 'right',
      render: (v, row) => <UpdateOrderEntry k='discount' pid={row.pid._id} val={v} onUpdate={onUpdate} disable={!changeAllowed} />,
      width: 110
    },
    {
      title: 'Amount (INR)',
      align: 'right',
      render: (_, row) => (row.rate * row.quantity * ((100 - row.discount) / 100)).toFixed(2),
      width: 180
    },
    {
      title: 'Remove',
      dataIndex: ['pid', '_id'],
      align: 'center',
      render: (v) => <Popconfirm title='Remove this order' placement="topLeft" onConfirm={() => remOrder(v)}><Button size="small" danger icon={<CloseOutlined />} disabled={!changeAllowed} /></Popconfirm>,
      width: 100
    },
    {
      title: 'Returned',
      dataIndex: 'return',
      align: 'right',
      render: (v, row) => <UpdateOrderEntry k='return' pid={row.pid._id} val={v} onUpdate={onUpdate} display={v => v || 0} disable={!returnAllowed} />,
      width: 110,
    },
  ];

  const amounts = useMemo(() => {
    return data?.reduce((agg, curr) => {
      const gst = curr.sgst + curr.cgst;
      const gstExcludedRate = curr.rate / ((100 + gst) / 100);
      const discount = gstExcludedRate * (curr.discount / 100);
      const effectiveRate = gstExcludedRate - discount;
      const cgst = effectiveRate * (curr.cgst / 100);
      const sgst = effectiveRate * (curr.sgst / 100);

      return {
        ...agg,
        amount: agg.amount + gstExcludedRate * curr.quantity,
        sgst: agg.sgst + sgst * curr.quantity,
        cgst: agg.cgst + cgst * curr.quantity,
        discount: agg.discount + discount * curr.quantity,
        payable: agg.payable + (effectiveRate + cgst + sgst) * curr.quantity,
      }
    }, { amount: 0, sgst: 0, cgst: 0, discount: 0, payable: 0 })
  }, [data])
  const round = ((((amounts?.payable * 100) % 100).toFixed(0)) / 100).toFixed(2)

  if (isError)
    return <Alert message='Failed to load bill orders' />

  return (
    <Flex vertical gap={16}>
      <Row gutter={[10, 0]}>
        <Col span={16}>
          <ProductSearch onAdd={(d) => addOrder.mutateAsync(d)} disable={!changeAllowed} />
        </Col>
        <Col span={8}>
          <Card size="small" title='Bill Total Amount (INR)' style={{ minHeight: '100%' }}>
            <Flex vertical>
              <Row justify='space-between'><Col>Amount:</Col><Col>{amounts?.amount.toFixed(2) || '-'}</Col></Row>
              <Row justify='space-between'><Col>Discount:</Col><Col>{amounts?.discount.toFixed(2) || '-'}</Col></Row>
              <Row justify='space-between'><Col>SGST + CGST:</Col><Col>{amounts?.sgst.toFixed(2) || '-'} + {amounts?.cgst.toFixed(2) || '-'} = {(amounts?.cgst + amounts?.sgst).toFixed(2)}</Col></Row>
              <Row justify='space-between'><Col>Net Amount:</Col><Col>{amounts?.payable.toFixed(2) || '-'}</Col></Row>
              <Row justify='space-between'><Col>Round off:</Col><Col>{round || '-'}</Col></Row>
              <Row justify='space-between'><Col><strong>Net Payable:</strong></Col><Col><strong>{(amounts?.payable - round).toFixed(2) || '-'}</strong></Col></Row>
            </Flex>
          </Card>
        </Col>
      </Row>
      <Table
        bordered
        size="small"
        columns={cols.filter(c => !c.hidden)}
        dataSource={data}
        loading={isLoading}
        rowKey={r => r.pid._id}
        pagination={false}
      />
    </Flex>
  )
}

export default OrderManager
