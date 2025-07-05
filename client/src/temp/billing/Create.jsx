import { Row, Form, Button, App, Card, Typography, Divider, Space, DatePicker } from "antd"
import { useCreateBill } from "../../hooks/billing-api"
import BillBuyerForm from "../../components/BillBuyerForm";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Create() {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const createBill = useCreateBill();
  const { message } = App.useApp()

  async function onFinish(data) {
    try {
      const body = {
        ...data,
        buyer: data.buyerId ? null : data.buyer
      }
      const res = await createBill.mutateAsync(body);
      message.success('Bill created successfully')
      navigate('/billing/' + res.data._id);
    }
    catch {
      message.error('Failed to create bill')
    }
  }

  return (
    <>
      <Card style={{ minHeight: '100%' }}>
        <Typography.Title level={4}>Create Bill</Typography.Title>
        <Divider />
        <Form
          form={form}
          name='create-bill'
          onFinish={onFinish}
          labelCol={{ span: 3 }}
          labelAlign="left"
          onValuesChange={(v) => v.buyerId && form.resetFields(['buyer'])}
        >
          <Form.Item label='Bill Date' name='billDate' rules={[{ required: true }]} initialValue={dayjs()}>
            <DatePicker style={{ width: '30%' }} format={['DD-MM-YYYY']} />
          </Form.Item>
          <Typography.Title level={5}>Buyer Information</Typography.Title>
          <BillBuyerForm />
          <Row justify='space-between'>
            <strong>Help: Product orders for this bill can be handled after saving this step</strong>
            <Space>
              <Link to={-1}>
                <Button disabled={createBill.isLoading} size="large" danger>Cancel</Button>
              </Link>
              <Button loading={createBill.isLoading} size="large" type="primary" htmlType="submit">Save</Button>
            </Space>
          </Row>
        </Form>
      </Card>
    </>
  )
}

export default Create