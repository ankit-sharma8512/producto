import { Alert, App, Button, DatePicker, Divider, Form, Row, Space, Spin, Typography } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUpdateBill, useBillDetail } from "../../hooks/billing-api";
import dayjs from "dayjs";
import BillBuyerForm from "../../components/BillBuyerForm";

function UpdateOrder() {
    const { id }      = useParams();
    const [form]      = Form.useForm();
    const navigate    = useNavigate()
    const updateBill  = useUpdateBill();
    const { message } = App.useApp()
    const { data, isLoading, isError } = useBillDetail(id);

    async function onFinish(data) {
        try {
            const body = { id, ...data, buyer: data.buyerId ? null : data.buyer, buyerId: data.buyerId ?? null };

            await updateBill.mutateAsync(body); 

            message.success('Order updated successfully')
            navigate('/order/' + id);
        }
        catch {
            message.error('Failed to create bill')
        }
    }

    if (isError)
        return <Alert type="error" message='Failed to load order details' />

    if (isLoading)
        return <Spin />

    const initial = {
        billDate : dayjs(data.date),
        buyerId  : data.buyerId?._id,
        buyer    : data.buyer || null
    };
    const initialBuyers = data.buyerId ? [data.buyerId] : null;

    return (
        <>
            <Typography.Title level={4}>Update Order</Typography.Title>
            <Divider />
            <Form
                form           = {form}
                name           = 'create-order'
                onFinish       = {onFinish}
                labelCol       = {{ span: 3 }}
                labelAlign     = "left"
                initialValues  = {initial}
                onValuesChange = {(v) => v.buyerId && form.resetFields(['buyer'])}
            >
            <Form.Item label='Bill Date' name='date' rules={[{ required: true }]} initialValue={dayjs()}>
                <DatePicker style={{ width: '30%' }} format={['DD-MM-YYYY']} />
            </Form.Item>
            <Typography.Title level={5}>Buyer Information</Typography.Title>
            <BillBuyerForm initialBuyers={initialBuyers} />
            <Row justify='space-between'>
                <strong>Help: Product orders can be handled after saving this step</strong>
                <Space>
                    <Link to={-1}>
                        <Button disabled={updateBill.isLoading} size="large" danger>Cancel</Button>
                    </Link>
                    <Button loading={updateBill.isLoading} size="large" type="primary" htmlType="submit">Update</Button>
                </Space>
            </Row>
            </Form>
        </>
    );
}

export default UpdateOrder;