import { Form, Input, Button, Flex, App } from "antd"
import { useAddTrader, useUpdateTrader } from "../../hooks/trader-api"

const rule = [{ required: true, message: 'Please enter this field' }]

function CreateTrader({ type, trader, onClose }) {
  const { message: msg } = App.useApp()
  const addTrader = useAddTrader()
  const updateTrader = useUpdateTrader()

  async function onFinish(data) {
    try {
      if (trader) {
        await updateTrader.mutateAsync({ ...data, _id: trader._id });
        msg.success('Trader updated sucessfully');
      }
      else {
        await addTrader.mutateAsync({ ...data, type });
        msg.success('Trader added sucessfully');
      }
      onClose()
    }
    catch {
      msg.error('Failed to add/update trader')
    }
  }

  const initial = trader ? trader : {}

  return (
    <>
      <Form
        name='add-trader'
        onFinish={onFinish}
        layout="horizontal"
        labelCol={{ span: 5 }}
        labelAlign="left"
        preserve={false}
        initialValues={initial}
      >

        <Form.Item name='name' label='Name' rules={rule}>
          <Input placeholder="Enter Name" />
        </Form.Item>
        <Form.Item name='gstin' label='GSTIN'>
          <Input placeholder="Enter GSTIN" />
        </Form.Item>
        <Form.Item name='contact' label='Contact' rules={rule}>
          <Input placeholder="Enter Contact Number" style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item name='address' label='Address'>
          <Input placeholder="Enter address" />
        </Form.Item>
        {
          type === 'buyer' &&
          <Form.Item name='placeOfSupply' label='Place of Supply'>
            <Input placeholder="Enter place of supply" />
          </Form.Item>
        }
        <Flex justify='end' gap={10}>
          <Button disabled={addTrader.isLoading || updateTrader.isLoading} onClick={onClose}>Cancel</Button>
          <Button loading={addTrader.isLoading || updateTrader.isLoading} htmlType="submit" type="primary">{trader ? 'Update' : 'Add'}</Button>
        </Flex>
      </Form>
    </>
  )
}

export default CreateTrader;