import { Form, Input, InputNumber, Button, Flex, App, Select } from "antd"
import { useAddProduct, useUpdateProduct } from "../../hooks/product-api"

const rule = [{ required: true, message: 'Please enter this field' }]
const brands = [{ label: 'VLCC', value: 'VLCC' }, { label:'Ustraa', value:'Ustraa' }, { label: 'Vega', value: 'Vega' },{label:'Lotus', value:'Lotus'}];

function CreateProduct({ product, onClose }) {
  const addProduct = useAddProduct()
  const updateProduct = useUpdateProduct()
  const { message: msg } = App.useApp()

  async function onFinish(data) {
    try {
      if (product) {
        await updateProduct.mutateAsync({ _id: product._id, ...data });
        msg.success('Product updated sucessfully');
      }
      else {
        await addProduct.mutateAsync(data);
        msg.success('Product added sucessfully');
      }
      onClose()
    }
    catch {
      msg.error('Failed to add/update product')
    }
  }

  const initial = product ? product : {}

  return (
    <>
      <Form
        name='add-prod'
        onFinish={onFinish}
        layout="horizontal"
        labelCol={{ span: 5 }}
        labelAlign="left"
        preserve={false}
        initialValues={initial}
      >
        <Form.Item name='brand' label='Brand' rules={rule}>
          <Select options={brands} placeholder='Enter brand' />
        </Form.Item>
        <Form.Item name='name' label='Name' rules={rule}>
          <Input placeholder="Enter Name" />
        </Form.Item>
        <Form.Item name='hsn' label='HSN Code' rules={rule}>
          <Input placeholder="Enter HSN Code" />
        </Form.Item>
        <Form.Item name='mrp' label='MRP (INR)' rules={rule}>
          <InputNumber placeholder="Enter Product MRP" style={{ width: '40%' }} />
        </Form.Item>
        <Flex justify='end' gap={10}>
          <Button disabled={addProduct.isLoading || updateProduct.isLoading} onClick={onClose}>Cancel</Button>
          <Button loading={addProduct.isLoading || updateProduct.isLoading} htmlType="submit" type="primary">{product ? 'Update' : 'Add'}</Button>
        </Flex>
      </Form>
    </>
  )
}

export default CreateProduct;
