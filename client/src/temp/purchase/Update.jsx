import { Form, Button, Flex, App, Card, Typography, Divider, Alert, Spin, DatePicker, InputNumber } from "antd"
import { Link, useNavigate, useParams } from "react-router-dom"
import PurchaseVendorForm from "../../components/PurchaseVendorForm";
import dayjs from "dayjs";
import { usePurchaseDetail, useUpdatePurchase } from "../../hooks/purchase-api";

function Update() {
  const { id } = useParams();
  const { data, isLoading, isError } = usePurchaseDetail(id);
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const updatePurchase = useUpdatePurchase(id)
  const { message: msg } = App.useApp()

  async function onFinish(data) {
    try {
      const body = { id, ...data, vendor: data.vendorId ? null : data.vendor, vendorId: data.vendorId ?? null };
      await updatePurchase.mutateAsync(body)
      msg.success('Purchase updated successfully');
      navigate('/purchase/' + id);
    }
    catch (err) {
      console.error(err)
      msg.error('Failed to update purchase')
    }
  }

  if (isError)
    return <Alert type="error" message='Failed to load purchase details' />

  if (isLoading)
    return <Spin />

  const initial = {
    total: data.total || null,
    purchaseDate: dayjs(data.purchaseDate),
    vendorId: data.vendorId?._id,
    vendor: data.vendor || null
  };
  const initialVendors = data.vendorId ? [data.vendorId] : null;

  return (
    <>
      <Card style={{ minHeight: '100%' }}>
        <Typography.Title level={4}>Update Purchase</Typography.Title>
        <Divider />
        <Form
          form={form}
          name='update-purchase'
          onFinish={onFinish}
          layout="horizontal"
          labelCol={{ span: 3 }}
          labelAlign="left"
          preserve={false}
          initialValues={initial}
          onValuesChange={(v) => v.vendorId && form.setFieldValue(['vendor'], null)}
        >
          <Form.Item label='Purchase Date' name='purchaseDate' rules={[{ required: true }]}>
            <DatePicker style={{ width: '30%' }} format={['DD-MM-YYYY']} />
          </Form.Item>
          <Form.Item label='Purchase Total Amount' name='total' rules={[{ required: true }]}>
            <InputNumber placeholder="Amount" style={{ width: '20%' }} />
          </Form.Item>
          <Typography.Title level={5}>Vendor Information</Typography.Title>
          <PurchaseVendorForm initialVendors={initialVendors} />
          <Flex justify='end' gap={10} style={{ marginTop: '10px' }}>
            <Link to={-1}><Button disabled={updatePurchase.isLoading}>Discard</Button></Link>
            <Button loading={updatePurchase.isLoading} htmlType="submit" type="primary">Update</Button>
          </Flex>
        </Form>
      </Card>
    </>
  )
}

export default Update