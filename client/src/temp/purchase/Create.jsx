import { Row, Form, Button, App, Card, Typography, Divider, Space, DatePicker, InputNumber } from "antd"
import PurchaseVendorForm from "../../components/PurchaseVendorForm";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useCreatePurchase } from "../../hooks/purchase-api";

function Create() {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const createPurchase = useCreatePurchase();
  const { message } = App.useApp()

  async function onFinish(data) {
    try {
      const body = {
        ...data,
        vendor: data.vendorId ? null : data.vendor
      }
      const res = await createPurchase.mutateAsync(body);
      message.success('Purchase created successfully')
      navigate('/purchase/' + res.data._id);
    }
    catch {
      message.error('Failed to create purchase')
    }
  }

  return (
    <>
      <Card style={{ minHeight: '100%' }}>
        <Typography.Title level={4}>Add Purchase</Typography.Title>
        <Divider />
        <Form
          form={form}
          name='create-purchase'
          onFinish={onFinish}
          labelCol={{ span: 3 }}
          labelAlign="left"
          onValuesChange={(v) => v.vendorId && form.resetFields(['vendor'])}
        >
          <Form.Item label='Purchase Date' name='purchaseDate' rules={[{ required: true }]} initialValue={dayjs()}>
            <DatePicker style={{ width: '30%' }} format={['DD-MM-YYYY']} />
          </Form.Item>
          <Form.Item label='Purchase Total Amount' name='total' rules={[{ required: true }]}>
            <InputNumber placeholder="Amount" />
          </Form.Item>
          <Typography.Title level={5}>Vendor Information</Typography.Title>
          <PurchaseVendorForm />
          <Row justify='space-between'>
            <strong>Help: Purchase orders for this purchase can be handled after saving this step</strong>
            <Space>
              <Link to={-1}>
                <Button disabled={createPurchase.isLoading} size="large" danger>Cancel</Button>
              </Link>
              <Button loading={createPurchase.isLoading} size="large" type="primary" htmlType="submit">Save</Button>
            </Space>
          </Row>
        </Form>
      </Card>
    </>
  )
}

export default Create