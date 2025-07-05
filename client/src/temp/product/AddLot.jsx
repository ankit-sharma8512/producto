import { Form, Button, Flex, App, DatePicker, InputNumber, Typography } from "antd"
import { useAddLot, useUpdateProductLot } from "../../hooks/product-api"
import dayjs from "dayjs";

const { Title, Text } = Typography;
const rule = [{ required: true, message: 'Please enter this field' }]
const dateFormat = ['DD-MM-YYYY', 'MM-YYYY'];

function AddLot({ product, lot, onClose }) {
  const addProductLot = useAddLot()
  const updateProductLot = useUpdateProductLot()
  const { message: msg } = App.useApp()

  async function onFinish(data) {
    try {
      if (lot) {
        await updateProductLot.mutateAsync({ _id: lot._id, ...data });
        msg.success('Product lot updated sucessfully');
      }
      else {
        await addProductLot.mutateAsync({ ...data, pid: product._id });
        msg.success('Product lot added sucessfully');
      }
      onClose()
    }
    catch {
      msg.error('Failed to add/update product lot')
    }
  }

  const initial = lot ? { ...lot, mfgDate: lot.mfgDate ? dayjs(lot.mfgDate) : null, expDate: lot.expDate ? dayjs(lot.expDate) : null } : {}

  return (
    <>
      <Text><strong>{product.name}</strong> | Brand: {product.brand} | HSN: {product.hsn}</Text>
      <Title level={5}>Lot Information</Title>
      <Form
        name='add-prod-lot'
        onFinish={onFinish}
        layout="horizontal"
        labelCol={{ span: 8 }}
        labelAlign="left"
        preserve={false}
        initialValues={initial}
      >
        <Form.Item name='mfgDate' label='Manufactured Date' help={dateFormat.join(' or ')}>
          <DatePicker style={{ width: '50%' }} format={dateFormat} />
        </Form.Item>
        <Form.Item name='expDate' label='Expiry Date' help={dateFormat.join(' or ')}>
          <DatePicker style={{ width: '50%' }} format={dateFormat} />
        </Form.Item>
        <Form.Item name='quantity' label='Quantity' rules={rule}>
          <InputNumber placeholder="Enter Quantity" style={{ width: '40%' }} />
        </Form.Item>
        <Form.Item name='price' label='Price (INR)' rules={rule}>
          <InputNumber placeholder="Enter Price" style={{ width: '40%' }} />
        </Form.Item>
        <Flex justify='end' gap={10}>
          <Button disabled={addProductLot.isLoading} onClick={onClose}>Cancel</Button>
          <Button loading={addProductLot.isLoading} htmlType="submit" type="primary">{lot ? 'Update' : 'Add'}</Button>
        </Flex>
      </Form>
    </>
  )
}

export default AddLot;