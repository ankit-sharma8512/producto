import { Alert, App, Button, DatePicker, Divider, Form, InputNumber, Row, Space, Spin, Typography } from "antd";
import PurchaseVendorForm from "../../components/PurchaseVendorForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePurchaseDetail, useUpdatePurchase } from "../../hooks/purchase-api";
import dayjs from "dayjs";

function PurchaseCreate() {
    const {id}                         = useParams()
    const [form]                       = Form.useForm();
    const { data, isLoading, isError } = usePurchaseDetail(id);
    const updatePurchase               = useUpdatePurchase(id)
    const { message }                  = App.useApp()
    const navigate                     = useNavigate()

    async function onFinish(data) {
        try {
            const body = { id, ...data, vendor: data.vendorId ? null : data.vendor, vendorId: data.vendorId ?? null };

            const res = await updatePurchase.mutateAsync(body);
            message.success('Purchase updated successfully')

            console.log(res)
            navigate('/purchase/' + res._id);
        }
        catch {
            message.error('Failed to update purchase')
        }
    }

    if (isError)
        return <Alert type="error" message='Failed to load purchase details' />

    if (isLoading)
        return <Spin />

    const initial = {
        total        : data.total || null,
        date         : dayjs(data.date),
        vendorId     : data.vendorId?._id,
        vendor       : data.vendor || null
    };
    const initialVendors = data.vendorId ? [data.vendorId] : null;
    
    return (
        <>
            <Typography.Title level={4}>Update Purchase</Typography.Title>
            <Divider />
            <Form
                form           = {form}
                name           = 'update-purchase'
                onFinish       = {onFinish}
                labelCol       = {{ span: 3 }}
                initialValues  = {initial}
                labelAlign     = "left"
                onValuesChange = {(v) => v.vendorId && form.resetFields(['vendor'])}
            >
            <Form.Item label='Purchase Date' name='date' rules={[{ required: true }]} initialValue={dayjs()}>
                <DatePicker style={{ width: '30%' }} format={['DD-MM-YYYY']} />
            </Form.Item>
            <Form.Item label='Purchase Total Amount' name='total' rules={[{ required: true }]}>
                <InputNumber placeholder="Amount" />
            </Form.Item>

            <Typography.Title level={5}>Vendor Information</Typography.Title>
            <PurchaseVendorForm initialVendors={initialVendors}/>

            <Row justify='space-between'>
                <strong>Help: Purchase orders for this purchase can be handled after saving this step</strong>
                <Space>
                    <Link to={-1}>
                        <Button disabled={updatePurchase.isLoading} size="large" danger>Cancel</Button>
                    </Link>
                    <Button loading={updatePurchase.isLoading} size="large" type="primary" htmlType="submit">Save</Button>
                </Space>
            </Row>
            </Form>
        </>
    );
}

export default PurchaseCreate