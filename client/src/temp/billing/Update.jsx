import { Form, Button, Flex, App, Card, Typography, Divider, Alert, Spin, DatePicker } from "antd"
import { useBillDetail, useUpdateBill } from "../../hooks/billing-api"
import { Link, useNavigate, useParams } from "react-router-dom"
import BillBuyerForm from "../../components/BillBuyerForm";
import dayjs from "dayjs";

function Update() {
  const { id } = useParams();
  const { data, isLoading, isError } = useBillDetail(id);
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const updateBill = useUpdateBill(id)
  const { message: msg } = App.useApp()

  async function onFinish(data) {
    try {
      const body = { id, ...data, buyer: data.buyerId ? null : data.buyer, buyerId: data.buyerId ?? null };
      console.log(body)
      await updateBill.mutateAsync(body)
      msg.success('Bill updated successfully');
      navigate('/billing/' + id);
    }
    catch (err) {
      console.error(err)
      msg.error('Failed to update bill')
    }
  }

  if (isError)
    return <Alert type="error" message='Failed to load bill details' />

  if (isLoading)
    return <Spin />

  const initial = {
    billDate: dayjs(data.billDate),
    buyerId: data.buyerId?._id,
    buyer: data.buyer || null
  };
  const initialBuyers = data.buyerId ? [data.buyerId] : null;
  console.log(initialBuyers)

  return (
    <>
      <Card style={{ minHeight: '100%' }}>
        <Typography.Title level={4}>Update Bill: {data.billNo}</Typography.Title>
        <Divider />
        <Form
          form={form}
          name='update-bill'
          onFinish={onFinish}
          layout="horizontal"
          labelCol={{ span: 3 }}
          labelAlign="left"
          preserve={false}
          initialValues={initial}
          onValuesChange={(v) => v.buyerId && form.setFieldValue(['buyer'], null)}
        >
          <Form.Item label='Bill Date' name='billDate' rules={[{ required: true }]}>
            <DatePicker style={{ width: '30%' }} format={['DD-MM-YYYY']} />
          </Form.Item>
          <Typography.Title level={5}>Buyer Information</Typography.Title>
          <BillBuyerForm initialBuyers={initialBuyers} />
          <Flex justify='end' gap={10} style={{ marginTop: '10px' }}>
            <Link to={-1}><Button disabled={updateBill.isLoading}>Discard</Button></Link>
            <Button loading={updateBill.isLoading} htmlType="submit" type="primary">Update</Button>
          </Flex>
        </Form>
      </Card>
    </>
  )
}

export default Update