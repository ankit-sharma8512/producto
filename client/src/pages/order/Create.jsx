import { App, Button, DatePicker, Divider, Form, Row, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCreateBill } from "../../hooks/billing-api";
import dayjs from "dayjs";
import BillBuyerForm from "../../components/BillBuyerForm";

function Create() {
    const [form]      = Form.useForm();
    const navigate    = useNavigate()
    const createBill  = useCreateBill();
    const { message } = App.useApp()

    async function onFinish(data) {
        try {
            const body = {
                ...data,
                buyer: data.buyerId ? null : data.buyer
            }
            const res = await createBill.mutateAsync(body); 
            message.success('Order created successfully')
            navigate('/order/' + res.data._id);
        }
        catch {
            message.error('Failed to create bill')
        }
    }

    return (
        <>
            <Typography.Title level={4}>Create Order</Typography.Title>
            <Divider />
            <Form
                form           = {form}
                name           = 'create-order'
                onFinish       = {onFinish}
                labelCol       = {{ span: 3 }}
                labelAlign     = "left"
                onValuesChange = {(v) => v.buyerId && form.resetFields(['buyer'])}
            >
            <Form.Item label='Bill Date' name='date' rules={[{ required: true }]} initialValue={dayjs()}>
                <DatePicker style={{ width: '30%' }} format={['DD-MM-YYYY']} />
            </Form.Item>
            <Typography.Title level={5}>Buyer Information</Typography.Title>
            <BillBuyerForm />
            <Row justify='space-between'>
                <strong>Help: Product orders can be handled after saving this step</strong>
                <Space>
                    <Link to={-1}>
                        <Button disabled={createBill.isLoading} size="large" danger>Cancel</Button>
                    </Link>
                    <Button loading={createBill.isLoading} size="large" type="primary" htmlType="submit">Create</Button>
                </Space>
            </Row>
            </Form>
        </>
    );
}

export default Create;